import type { Metadata } from "next"; import "./globals.css";
export const metadata: Metadata={title:"T-Shoe | Footwear Store",description:"Shop your next favourite pair at T-Shoe."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}