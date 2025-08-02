// next.config.ts
const nextConfig = {
images: {
dangerouslyAllowSVG: true,
contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
remotePatterns: [
{
protocol: 'https',
hostname: 'placehold.co',
},
],
},
}

export default nextConfig;

