export function GET(request: Request) {
  return Response.redirect(new URL("/zh", request.url), 308);
}
