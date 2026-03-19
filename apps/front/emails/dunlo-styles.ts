/**
 * Styles partagés pour les emails Dunlo — alignés sur la palette de l'app
 * Palette: globals.css — Dunlo dark theme
 */

export const dunloStyles = {
  main: {
    backgroundColor: "#040404",
    fontFamily:
      '"Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  } as const,

  container: {
    backgroundColor: "#161616",
    margin: "0 auto",
    padding: "40px 32px",
    maxWidth: "560px",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.06)",
  } as const,

  header: {
    marginBottom: "32px",
    paddingBottom: "24px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
  } as const,

  logo: {
    color: "#ebebeb",
    fontSize: "22px",
    fontFamily: '"Instrument Serif", Georgia, serif',
    fontWeight: "400" as const,
    letterSpacing: "-0.02em",
  } as const,

  h1: {
    color: "#ebebeb",
    fontSize: "24px",
    fontFamily: '"Instrument Serif", Georgia, serif',
    fontWeight: "400" as const,
    margin: "0 0 20px",
    letterSpacing: "-0.02em",
  } as const,

  text: {
    color: "#8a8a8a",
    fontSize: "16px",
    lineHeight: "26px",
    margin: "0 0 16px",
  } as const,

  textStrong: {
    color: "#ebebeb",
    fontSize: "16px",
    fontWeight: "600" as const,
    lineHeight: "26px",
    margin: "0 0 16px",
  } as const,

  buttonContainer: {
    margin: "28px 0",
  } as const,

  button: {
    backgroundColor: "#00e87b",
    borderRadius: "8px",
    color: "#040404",
    fontSize: "15px",
    fontWeight: "600" as const,
    textDecoration: "none",
    padding: "14px 28px",
    display: "inline-block",
  } as const,

  buttonUrgent: {
    backgroundColor: "#e53e3e",
    borderRadius: "8px",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "600" as const,
    textDecoration: "none",
    padding: "14px 28px",
    display: "inline-block",
  } as const,

  footer: {
    color: "#555555",
    fontSize: "14px",
    lineHeight: "22px",
    marginTop: "28px",
    paddingTop: "24px",
    borderTop: "1px solid rgba(255, 255, 255, 0.06)",
  } as const,
} as const;

export const dunloFontsLink =
  'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@400;500;600;700&display=swap';
