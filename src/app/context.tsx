"use client";

import { AuthProvider } from "@/context/AuthContext";
import { ChatSessionProvider } from "@/context/ChatSessionContext";
import Protection from "@/utils/protection";
import Providers from "@/utils/providers";
import { Toaster } from "sonner";

const ContextProvider = ({ children }: { children: React.ReactNode }) => {
return (
    <Providers>
      <AuthProvider>
        <Protection>
          <ChatSessionProvider>
            {/* Main layout with flex to ensure footer is at the bottom */}
            <div className="flex flex-col min-h-screen">
            <main className="flex-grow">{children}</main>
            <Toaster richColors closeButton position="bottom-right" />
            </div>
          </ChatSessionProvider>
        </Protection>
      </AuthProvider>
    </Providers>
  );
};

export default ContextProvider;
