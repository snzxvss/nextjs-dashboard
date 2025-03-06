import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

export async function User() {
  return (
      <div className="ml-auto">
          <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button
                      variant="outline"
                      size="icon"
                      className="overflow-hidden rounded-full"
                  >
                      <Image
                          src={'/placeholder-user.jpg'}
                          width={36}
                          height={36}
                          alt="Avatar"
                          className="overflow-hidden rounded-full"
                      />
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Admin Alpha</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                      <Link className="text-red-600" href="/login">
                          Cerrar sesión
                      </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
              </DropdownMenuContent>
          </DropdownMenu>
      </div>
  );
}