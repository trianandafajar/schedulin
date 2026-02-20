import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/signin(.*)',
  '/signup(.*)',
  '/public/booking(.*)',
  '/api/webhooks(.*)',
  '/api(.*)',
  '/'
]);

const isAuthRoute = createRouteMatcher([
  '/signin(.*)',
  '/signup(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();
  const { pathname } = request.nextUrl;

  if (!userId && !isPublicRoute(request)) {
    return redirectToSignIn();
  }

  if (userId && isAuthRoute(request)) {  
    const onboardingComplete = sessionClaims?.metadata?.onboardingComplete === true;
    if (pathname.startsWith(process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL!)) {
      if (onboardingComplete) {
        return NextResponse.redirect(new URL(process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL!, request.url));
      }
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL(process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL!, request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};