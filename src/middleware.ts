import { NextResponse, NextRequest} from 'next/server';

export function middleware(request: NextRequest) {

    const isAuthenticated = false
    console.log("request: ", request.nextUrl.pathname);

    if (!isAuthenticated) {
        if (request.nextUrl.pathname === "/login") {
            return NextResponse.next();
        }

        return NextResponse.redirect(new URL("/login", request.url))
    } else {
        if (request.nextUrl.pathname === "/login") {
            return NextResponse.redirect(new URL("/bot", request.url))
        }
    }

    return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - All files inside the public folder can also be excluded
     */
    '/((?!_next/static|_next/image|favicon.ico|public/|assets/).*)',
  ],
};