import { ImageResponse } from "next/og";

export const alt = "Ancient AI Academy — A better human experience";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    backgroundColor: "#1A1614",
                    padding: "80px",
                    position: "relative",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: -140,
                        right: -140,
                        width: 460,
                        height: 460,
                        borderRadius: "9999px",
                        background:
                            "radial-gradient(circle, rgba(241,89,6,0.35), rgba(241,89,6,0))",
                        display: "flex",
                    }}
                />
                <div
                    style={{
                        display: "flex",
                        fontSize: 26,
                        letterSpacing: 10,
                        color: "#f15906",
                        fontWeight: 600,
                    }}
                >
                    ANCIENT AI ACADEMY
                </div>
                <div
                    style={{
                        display: "flex",
                        marginTop: 28,
                        fontSize: 78,
                        fontWeight: 700,
                        color: "#F5F5F5",
                        lineHeight: 1.05,
                        maxWidth: 900,
                    }}
                >
                    A better human experience
                </div>
                <div
                    style={{
                        display: "flex",
                        marginTop: 24,
                        fontSize: 34,
                        color: "#A8B9B9",
                    }}
                >
                    Strengthening the mind, body &amp; soul.
                </div>
            </div>
        ),
        { ...size },
    );
}
