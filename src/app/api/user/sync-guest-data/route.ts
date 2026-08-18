import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getVerifiedUser } from '@/lib/auth/getUserSession';

export async function POST(req: NextRequest) {
  try {
    const verifiedUser = await getVerifiedUser();
    if (!verifiedUser.isLoggedIn || verifiedUser.id === 'demo_user') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { guestProfile, guestConversations } = await req.json();

    // 1. Sync Profile details
    if (guestProfile) {
      const { fieldOfStudy, level, institution, graduationYear } = guestProfile;
      await prisma.user.update({
        where: { id: verifiedUser.id },
        data: {
          fieldOfStudy: fieldOfStudy || null,
          level: level || null,
          institution: institution || null,
          graduationYear: graduationYear ? parseInt(String(graduationYear), 10) : null,
          profileJson: guestProfile,
        },
      });
    }

    // 2. Sync Chat History details
    if (guestConversations && Array.isArray(guestConversations)) {
      for (const conv of guestConversations) {
        const { conversationId, messages } = conv;
        if (!conversationId || !messages || !Array.isArray(messages)) continue;

        const logsData = messages
          .filter((msg: any) => msg.content && (msg.role === 'user' || msg.role === 'assistant' || msg.role === 'agent'))
          .map((msg: any) => ({
            userId: verifiedUser.id,
            role: msg.role === 'assistant' || msg.role === 'agent' ? 'agent' : 'user',
            content: JSON.stringify({ conversationId, text: msg.content }),
            createdAt: msg.createdAt ? new Date(msg.createdAt) : new Date(),
          }));

        if (logsData.length > 0) {
          await prisma.conversationLog.createMany({
            data: logsData,
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Sync guest data error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
