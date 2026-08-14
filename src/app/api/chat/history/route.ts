import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getVerifiedUser } from '@/lib/auth/getUserSession';

const prisma = new PrismaClient();

// GET /api/chat/history
// Retrieves paginated message history for a user conversation
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get('conversationId') || 'default';
  const limit = parseInt(searchParams.get('limit') || '50');
  const before = searchParams.get('before'); // ISO timestamp for cursor pagination

  try {
    const verifiedUser = await getVerifiedUser();
    if (!verifiedUser.isLoggedIn || verifiedUser.id === 'demo_user') {
      return NextResponse.json({ success: true, messages: [] });
    }

    // Build query conditions
    const where: any = {
      userId: verifiedUser.id,
    };

    if (before) {
      where.createdAt = {
        lt: new Date(before),
      };
    }

    // Fetch records ordered by descending to get the latest messages first
    const logs = await prisma.conversationLog.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit + 1, // Get one extra to check if there are earlier messages
    });

    const hasMore = logs.length > limit;
    const paginatedLogs = hasMore ? logs.slice(0, limit) : logs;

    // Parse records and filter by conversationId
    const messages = paginatedLogs
      .map(log => {
        let text = log.content;
        let logConvId = 'default';

        try {
          if (log.content.startsWith('{') && log.content.endsWith('}')) {
            const parsed = JSON.parse(log.content);
            if (parsed && typeof parsed === 'object' && 'text' in parsed) {
              text = parsed.text;
              logConvId = parsed.conversationId || 'default';
            }
          }
        } catch {
          // Fallback to raw content if JSON parsing fails
        }

        return {
          id: log.id,
          role: log.role === 'agent' ? 'assistant' : 'user',
          content: text,
          createdAt: log.createdAt.toISOString(),
          conversationId: logConvId,
        };
      })
      .filter(msg => msg.conversationId === conversationId);

    // Since we queried desc, reverse to return chronologically (user expectations)
    messages.reverse();

    return NextResponse.json({
      success: true,
      messages,
      hasMore,
      nextCursor: hasMore && paginatedLogs.length > 0 ? paginatedLogs[paginatedLogs.length - 1].createdAt.toISOString() : null,
    });
  } catch (error: any) {
    console.error('[Chat History GET Error]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve conversation history' },
      { status: 500 }
    );
  }
}

// POST /api/chat/history
// Saves a single message to the conversation log
export async function POST(req: Request) {
  try {
    const verifiedUser = await getVerifiedUser();
    if (!verifiedUser.isLoggedIn || verifiedUser.id === 'demo_user') {
      return NextResponse.json({ success: true, saved: false });
    }

    const { role, content, conversationId = 'default' } = await req.json();

    if (!role || !content) {
      return NextResponse.json(
        { success: false, error: 'Role and content are required' },
        { status: 400 }
      );
    }

    const savedLog = await prisma.conversationLog.create({
      data: {
        userId: verifiedUser.id,
        role: role === 'assistant' ? 'agent' : 'user',
        content: JSON.stringify({ conversationId, text: content }),
      },
    });

    return NextResponse.json({
      success: true,
      message: {
        id: savedLog.id,
        role: savedLog.role === 'agent' ? 'assistant' : 'user',
        content,
        createdAt: savedLog.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('[Chat History POST Error]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save message log' },
      { status: 500 }
    );
  }
}
