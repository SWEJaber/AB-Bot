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