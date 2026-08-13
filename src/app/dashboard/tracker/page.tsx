import React from 'react';
import { KanbanBoard } from '@/components/tracker/KanbanBoard';

export const metadata = {
  title: 'Application Tracker | AtlasFind',
  description: 'Manage and track your global scholarship, internship, and fellowship applications in one place.',
};

export default function TrackerPage() {
  return <KanbanBoard />;
}
