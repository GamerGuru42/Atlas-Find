import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { verifyAdminAccess } from '@/lib/auth/adminAuth';

export async function GET(request: Request) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

    try {
      const pendingOpps = await prisma.opportunity.findMany({
        where: {
          OR: [
            { verificationStatus: 'pending' },
            { verificationStatus: 'unverified' },
            { verificationStatus: 'flagged' },
          ],
        },
        include: {
          intakes: true,
          verificationLogs: {
            orderBy: { checkedAt: 'desc' },
            take: 2,
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ opportunities: pendingOpps });
    } catch (error: any) {
      console.error('Error fetching admin opportunities:', error);
      return NextResponse.json(
        { error: 'Failed to fetch opportunities' },
        { status: 500 }
      );
    }
  }

  export async function PATCH(request: Request) {
    const auth = verifyAdminAccess(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
    }

    try {
      const body = await request.json();
      const { id, action, data, reason } = body;

      if (!id || !action) {
        return NextResponse.json({ error: 'Missing required opportunity id or action' }, { status: 400 });
      }

      const existing = await prisma.opportunity.findUnique({ where: { id } });
      if (!existing) {
        return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
      }

      let updated;
      if (action === 'approve') {
          updated = await prisma.opportunity.update({
            where: { id },
            data: { verificationStatus: 'verified', trustTier: 2, scamFlag: false },
          });
          } else if (action === 'reject') {
            updated = await prisma.opportunity.update({
              where: { id },
              data: { verificationStatus: 'rejected', scamFlag: true },
            });
            } else if (action === 'edit' && data) {
              updated = await prisma.opportunity.update({
                where: { id },
                data,
              });
            } else {
              return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
            }

            // Write audit record
            await prisma.verificationLog.create({
              data: {
                opportunityId: id,
                status: updated.verificationStatus,
                details: JSON.stringify({
                  action,
                  reviewer: auth.reviewer,
                  previousStatus: existing.verificationStatus,
                  reason: reason || `Admin action: ${action}`,
                }),
              },
            });

            return NextResponse.json({ success: true, opportunity: updated });
          } catch (error: any) {
            console.error('Error updating opportunity:', error);
            return NextResponse.json(
              { error: 'Failed to update opportunity' },
              { status: 500 }
            );
          }
        }

        export async function DELETE(request: Request) {
          const auth = verifyAdminAccess(request);
          if (!auth.authorized) {
            return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
          }

          try {
            const url = new URL(request.url);
            const id = url.searchParams.get('id');

            if (!id) {
              return NextResponse.json({ error: 'Missing id' }, { status: 400 });
            }

            await prisma.verificationLog.deleteMany({ where: { opportunityId: id } });
            await prisma.intake.deleteMany({ where: { opportunityId: id } });
            await prisma.savedOpportunity.deleteMany({ where: { opportunityId: id } });

            await prisma.opportunity.delete({
              where: { id },
            });

            return NextResponse.json({ success: true, message: `Opportunity ${id} deleted.` });
          } catch (error: any) {
            console.error('Error deleting opportunity:', error);
            return NextResponse.json(
              { error: 'Failed to delete opportunity' },
              { status: 500 }
            );
          }
        }
