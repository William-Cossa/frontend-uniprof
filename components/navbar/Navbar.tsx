import React from "react";
import { navLinks } from "./Navlinks";
import NavItem from "./NavbarItem";
import Logo from "./Logo";
import MenuButton from "./MenuButton";
import AuthButtons from "./AuthButtons";
import PerfilUser from "./PerfilUser";
import { cookies } from "next/headers";
import * as jose from "jose";

interface DecodedUser {
  name?: string;
  apelido?: string;
}

function getUserFromToken(): DecodedUser | null {
  try {
    const token = cookies().get("uniprof_token")?.value;
    if (!token) return null;
    const payload = jose.decodeJwt(token);
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return { name: payload.name as string, apelido: payload.apelido as string };
  } catch {
    return null;
  }
}

export default function Navbar() {
  const user = getUserFromToken();

  return (
    <header className="sticky font-playfair top-0 z-50 border-b bg-card shadow-sm">
      <div className="max-w-7xl mx-auto md:px-4 lg:px-0  w-full  ">
        <div className="flex h-16 items-center justify-between w-full px-2 md:px-4">
          <Logo />
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {navLinks.map((link, index) => (
              <NavItem key={index} href={link.href} label={link.label} />
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex aspect-square rounded-full">
                <PerfilUser userName={user.name} userSurname={user.apelido} />
              </div>
            ) : (
              <div className="flex">
                <AuthButtons />
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center mr-4 gap-4">
            <MenuButton />
          </div>
        </div>
      </div>
    </header>
  );
}
