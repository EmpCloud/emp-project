import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const url = new URL(request.url);
  const pathname = url.pathname;
  if (pathname.startsWith('/w-m/member/member-email-verification') || pathname.startsWith('/w-m/member/forgot-password') || pathname.startsWith('/w-m/member/reset-password')) return NextResponse.next();
  const response = NextResponse.next();
  if (!token) {
  const isAdmin = request.cookies.get('isAdmin')?.value === 'true';
  if (isAdmin) return NextResponse.redirect(new URL('/w-m/admin/sign-in', request.url));
  else return NextResponse.redirect(new URL('/w-m/member/login', request.url));
}
  response.headers.set('x-debug-token', token || 'none');
  return response;
}

export const config = {
    matcher: [
        '/w-m/projects/all',
        '/w-m/tasks/all',
        '/w-m/dashboard',
        '/w-m/projects/create',
        '/w-m/tasks/create',
        '/w-m/tasks/review',
        '/w-m/members/all',
        '/w-m/config/task',
        '/w-m/config/shortcuts',
        '/w-m/config/shortcuts',
        '/w-m/history',
        '/w-m/help-and-support',
        '/w-m/chat/',
        '/w-m/configuration',
        '/w-m/config/basic',
        '/w-m/license-count-exceed',
        '/w-m/member/view',
        '/w-m/members/assign-role',
        '/w-m/members/restoreUsers',
        '/w-m/members/suspendedUsers',
        '/w-m/members/timesheets',
        '/w-m/members/client',
        '/w-m/members/groups',
        '/w-m/members/roles',
        '/w-m/permissions/all',
        '/w-m/pricing',
        '/w-m/reports/auto-email',
        '/w-m/reports/projects',
        '/w-m/select-dashboard',
        '/w-m/timeline/global',
        '/w-m/admin/view',
        '/w-m/admin/resendMail',

    ],
};
