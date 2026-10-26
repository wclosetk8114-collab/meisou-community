import Link from "next/link";
import { SITE } from "@/lib/site";
export default function Logo({ href = "/", light = false }: { href?: string; light?: boolean }) {
  return <Link href={href} className="logo" style={light ? { color: "#fff" } : undefined}><span className="mk" /><b>{SITE.name}</b></Link>;
}
