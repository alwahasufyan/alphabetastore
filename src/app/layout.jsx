import { Geist } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

export const geist = Geist({
  subsets: ["latin"]
});
import "overlayscrollbars/overlayscrollbars.css";


// THEME PROVIDER
import ThemeProvider from "theme/theme-provider";


// PRODUCT CART PROVIDER
import CartProvider from "contexts/CartContext";
import { AuthProvider } from "contexts/AuthContext";


// SITE SETTINGS PROVIDER
import SettingsProvider from "contexts/SettingContext";

// REACT QUERY PROVIDER
import ReactQueryProvider from "contexts/ReactQueryProvider";


// GLOBAL CUSTOM COMPONENTS
import RTL from "components/rtl";
import ProgressBar from "components/progress";


// IMPORT i18n SUPPORT FILE
import "i18n";


// ==============================================================


// ==============================================================

export default function RootLayout({
  children,
  modal
}) {
  return <html lang="ar" dir="rtl" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body id="body" className={geist.className}>
        <ReactQueryProvider>
          <AuthProvider>
            <CartProvider>
              <SettingsProvider>
                <ThemeProvider>
                  <RTL>
                    {modal}
                    {children}
                  </RTL>

                  <ProgressBar />
                </ThemeProvider>
              </SettingsProvider>
            </CartProvider>
          </AuthProvider>
        </ReactQueryProvider>

        <GoogleAnalytics gaId="G-XKPD36JXY0" />
      </body>
    </html>;
}