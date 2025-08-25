import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User } from 'lucide-react';
import { logout } from '@/entities/user';
import { toast } from 'sonner';

interface ProfileHeaderProps {
  email: string;
  fullName?: string | null;
  onLogout?: () => void;
}

export function ProfileHeader({ email, fullName, onLogout }: ProfileHeaderProps) {
  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Выход выполнен успешно');
      onLogout?.();
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Не удалось выполнить выход');
    }
  };

  const getInitials = (name: string | null | undefined): string => {
    if (!name) return email.charAt(0).toUpperCase();
    
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const displayName = fullName || email.split('@')[0];

  return (
    <div className="flex flex-col items-center space-y-3 sm:space-y-4 text-center">
      {/* Avatar */}
      <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-2 sm:border-4 border-brand/20 shadow-neon dark:shadow-neon-dark">
        <AvatarFallback className="bg-brand text-white text-lg sm:text-2xl font-display font-semibold">
          {getInitials(fullName)}
        </AvatarFallback>
      </Avatar>

      {/* Name and Email */}
      <div className="space-y-1 sm:space-y-2">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-ink">
          {displayName}
        </h1>
        <p className="text-muted text-xs sm:text-sm">
          {email}
        </p>
      </div>

      {/* Logout Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogout}
        className="border-muted text-muted hover:bg-muted/10 hover:text-ink transition-colors text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
      >
        <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
        Выйти
      </Button>
    </div>
  );
}
