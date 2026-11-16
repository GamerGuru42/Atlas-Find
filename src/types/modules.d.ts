declare module 'lucide-react' {
  import * as React from 'react';
  export type LucideProps = React.SVGProps<SVGSVGElement> & {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
    absoluteStrokeWidth?: boolean;
    className?: string;
  };
  export type LucideIcon = React.ForwardRefExoticComponent<
    LucideProps & React.RefAttributes<SVGSVGElement>
  >;
  export type Icon = LucideIcon;

  export const Sparkles: LucideIcon;
  export const X: LucideIcon;
  export const ExternalLink: LucideIcon;
  export const Calendar: LucideIcon;
  export const MapPin: LucideIcon;
  export const Briefcase: LucideIcon;
  export const GraduationCap: LucideIcon;
  export const DollarSign: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const Link: LucideIcon;
  export const Share2: LucideIcon;
  export const Filter: LucideIcon;
  export const Building2: LucideIcon;
  export const Compass: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const Heart: LucideIcon;
  export const Shield: LucideIcon;
  export const LayoutGrid: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const User: LucideIcon;
  export const Mail: LucideIcon;
  export const Globe: LucideIcon;
  export const Save: LucideIcon;
  export const Mic: LucideIcon;
  export const MicOff: LucideIcon;
  export const Send: LucideIcon;
  export const Square: LucideIcon;
  export const Menu: LucideIcon;
  export const Plus: LucideIcon;
  export const WifiOff: LucideIcon;
  export const Star: LucideIcon;
  export const HelpCircle: LucideIcon;
  export const Check: LucideIcon;
  export const CheckCheck: LucideIcon;
  export const ShieldAlert: LucideIcon;
  export const LogIn: LucideIcon;
  export const UserPlus: LucideIcon;
  export const Award: LucideIcon;
  export const ArrowUpRight: LucideIcon;
  export const Loader2: LucideIcon;
  export const MessageSquare: LucideIcon;
  export const XCircle: LucideIcon;
  export const Search: LucideIcon;
  export const RotateCcw: LucideIcon;
  export const Clock: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const CreditCard: LucideIcon;
  export const Zap: LucideIcon;
  export const Lock: LucideIcon;
  export const Smartphone: LucideIcon;
  export const CheckSquare: LucideIcon;
  export const FileText: LucideIcon;
  export const Activity: LucideIcon;
  export const Bell: LucideIcon;
  export const Archive: LucideIcon;
  export const Trash2: LucideIcon;
  export const Upload: LucideIcon;
  export const GripVertical: LucideIcon;
  export const Eye: LucideIcon;
  export const Edit3: LucideIcon;
  export const Moon: LucideIcon;
  export const Sun: LucideIcon;
}

declare module 'twilio' {
  const content: any;
  export default content;
}

declare module 'stripe' {
  const Stripe: any;
  export default Stripe;
}
