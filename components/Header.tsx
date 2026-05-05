"use client";

// import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from 'next/image';
import Link from "next/link";

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: "/movies", label: "Movies" },
    { href: "/theaters", label: "Theaters" },
    { href: "/trailers", label: "Trailers" },
    { href: "/membership", label: "Membership" },
  ];

  return (
    <header className="header">
      <div className="inner">
        <div className="header-content">
          <Link href="/" className="logo">
            {/* <img src="/image/logo.svg" alt="Logo" /> */}
            <Image
              src="/images/logo.svg"
              alt="logo"
              width={182}
              height={54}
            />
          </Link>
          <div className="header-info">
            <nav className="nav">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item ${pathname == item.href ? "is-active" : ""}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="group-action group-action-trigger">
              <button 
                type="button"
                className="group-action-item group-action-search"
              >
                <span className="icon">
                  <Image
                    src="/images/svg/icon-search.svg"
                    alt="Search icon"
                    width={18}
                    height={18}
                  />
                </span>
                <span className="text">Search</span>
              </button>
            </div>
            {/* <div className="group-action group-action-trigger">
              {user ? (
                <Link href="/account" className="group-action-item group-action-account">
                  <span className="icon">
                    <Image
                      // src={profile?.avatar || "/images/svg/icon-account.svg"}
                      src="/images/svg/icon-account.svg"
                      alt="Acount icon"
                      width={18}
                      height={18}
                    />
                  </span>
                  <span className="text">ACOUNT</span>
                </Link>
              ) : (
                <>
                  <button
                    type="button"
                    className="group-action-account btn-action-login"
                    onClick={() => {
                      setOpenLogin(true);
                      setIsMenuOpen(false);
                    }}
                  >
                    <span className="text">SIGN IN</span>
                  </button>
                  <button
                    type="button"
                    className="group-action-account btn-action-signup"
                    onClick={() => {
                      setOpenSignup(true);
                      setIsMenuOpen(false);
                    }}
                  >
                    <span className="text">SIGN UP</span>
                  </button>
                </>
              )}
            </div> */}
          </div>
        </div>
      </div>
    </header>
  );
}