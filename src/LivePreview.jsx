import { useState, useRef, useEffect } from "react";
import "./LivePreview.css";

function LivePreview() {
    const [inputUrl, setInput_Url] = useState("");
    const [previewUrl, setPreview_Url] = useState("");
    const [view_Mode, setView_Mode] = useState("preview");
    const [message, set_Message] = useState("");
    const [linkStatus, setLinkStatus] = useState("idle"); // "idle" | "checking" | "ready" | "notready"

    const containerRef = useRef(null);
    const [scale, setScale] = useState(1);

    const DESKTOP_WIDTH = 1440;
    const DESKTOP_HEIGHT = 900;

    useEffect(() => {
        const updateScale = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                setScale(containerWidth / DESKTOP_WIDTH);
            }
        };

        updateScale();

        const observer = new ResizeObserver(updateScale);
        if (containerRef.current) observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, []);

    const format_Url = (url) => {
        const trimmed_Url = url.trim();

        if (!trimmed_Url) {
            return "";
        }

        if (
            !trimmed_Url.startsWith("http://") &&
            !trimmed_Url.startsWith("https://")
        ) {
            return `https://${trimmed_Url}`;
        }

        return trimmed_Url;
    };

    const checkLinkStatus = async (url) => {
        setLinkStatus("checking");

        const controller = new AbortController();
        // If the host doesn't respond within 8s, treat it as not ready
        // instead of leaving the status stuck on "Checking..." forever.
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        try {
            // "no-cors" is required since most preview targets (Vercel, Netlify, etc.)
            // won't send CORS headers back to us. That means we can't read the actual
            // status code, but a resolved (even opaque) response tells us the host
            // responded, while a thrown error means it's unreachable — no response,
            // DNS failure, connection refused, timed out, blocked, etc.
            await fetch(url, { mode: "no-cors", cache: "no-store", signal: controller.signal });
            setLinkStatus("ready");
        } catch (error) {
            setLinkStatus("notready");
        } finally {
            clearTimeout(timeoutId);
        }
    };

    const loadPreview = () => {
        const formatted_Url = format_Url(inputUrl);

        if (!formatted_Url) {
            set_Message("* Enter valid preview link");
            return;
        }

        setPreview_Url(formatted_Url);
        set_Message("");
        checkLinkStatus(formatted_Url);
    };

    const clearInput = () => {
        setInput_Url("");
        setPreview_Url("");
        set_Message("");
        setLinkStatus("idle");
    };

    const copylink = async () => {
        if (!previewUrl) {
            set_Message("Load preview link first.");
            return;
        }

        try {
            await navigator.clipboard.writeText(previewUrl);
            set_Message("Preview link copied successfully.");
        } catch (error) {
            set_Message("The link could not be copied.");
        }
    };

    const sharelink = async () => {
        if (!previewUrl) {
            set_Message("Load a preview link first.");
            return;
        }

        try {
            if (navigator.share) {
                await navigator.share({
                    title: "STREAMLINE LIVE",
                    text: "View this project's changes.",
                    url: previewUrl,
                });
            } else {
                await navigator.clipboard.writeText(previewUrl);
                set_Message("Sharing is unavailable. The link was copied instead.");
            }
        } catch (error) {
            if (error.name !== "AbortError") {
                set_Message("The preview link could not be shared.");
            }
        }
    };

    return (
        <section className="live-preview-page" aria-label="Live Preview">
            <header className="preview-header">
                <div>
                    <p className="preview-label">STREAMLINE</p>
                    <h1>LIVE PREVIEW</h1>
                    <p className="preview-description">View and test your project more easily.</p>
                </div>

                <div className="header-buttons">
                    <button className="secondary-butt" type="button" onClick={copylink}>
                        Copy Link
                    </button>

                    <button className="primary-butt" type="button" onClick={sharelink}>
                        Share
                    </button>
                </div>
            </header>

            <section className="preview-controls">
                <div className="url-section">
                    <label htmlFor="preview-url">Preview URL</label>

                    <div className="url-input-group">
                        <div className="url-input-wrapper">
                            <i className="fa-solid fa-link input-icon" aria-hidden="true"></i>

                            <input
                                id="preview-url"
                                type="url"
                                placeholder="Paste your URL..."
                                value={inputUrl}
                                onChange={(event) => {
                                    const newUrl = event.target.value;
                                    setInput_Url(newUrl);
                                    set_Message("");

                                    if (newUrl.trim() === "") {
                                        setPreview_Url("");
                                        set_Message("");
                                        setLinkStatus("idle");
                                    }
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        loadPreview();
                                    }
                                }}
                            />

                            {inputUrl && (
                                <button
                                    type="button"
                                    className="clear-input"
                                    onClick={clearInput}
                                    aria-label="Clear preview URL"
                                    title="Clear URL"
                                >
                                    <i className="fa-solid fa-xmark" aria-hidden="true"></i>
                                </button>
                            )}
                        </div>

                        <button className="primary-butt" type="button" onClick={loadPreview}>
                            Load Preview
                        </button>
                    </div>

                    {message && <p className="status-message">{message}</p>}
                </div>

                <div className="view-switch">
                    <button
                        type="button"
                        className={view_Mode === "preview" ? "active-mode" : ""}
                        onClick={() => setView_Mode("preview")}
                    >
                        Live Preview
                    </button>

                    <button
                        type="button"
                        className={view_Mode === "project" ? "active-mode" : ""}
                        onClick={() => setView_Mode("project")}
                    >
                        Project View
                    </button>
                </div>
            </section>

            <section className={`preview-content ${view_Mode === "project" ? "project-layout" : ""}`}>
                {view_Mode === "project" && (
                    <aside className="project-panel">
                        <h2>Project Information</h2>

                        <div className="project-detail">
                            <span>Project</span>
                            <strong>STREAMLINE</strong>
                        </div>

                        <div className="project-detail">
                            <span>Branch</span>
                            <strong>feature/live-preview</strong>
                        </div>

                        <div className="project-detail">
                            <span>Status</span>
                            <strong
                                className={
                                    linkStatus === "ready"
                                        ? "status-ready"
                                        : linkStatus === "notready"
                                        ? "status-notready"
                                        : linkStatus === "checking"
                                        ? "status-checking"
                                        : "status-idle"
                                }
                            >
                                {linkStatus === "ready" && "Ready"}
                                {linkStatus === "notready" && "Not Ready"}
                                {linkStatus === "checking" && "Checking..."}
                                {linkStatus === "idle" && "No Link Loaded"}
                            </strong>
                        </div>

                        <div className="project-detail">
                            <span>Last Updated</span>
                            <strong>Just now</strong>
                        </div>

                        <div className="project-notes">
                            <h3>Review Notes</h3>
                            <textarea placeholder="Write feedback about the preview..."></textarea>
                            <button className="primary-butt" type="button">
                                Save Feedback
                            </button>
                        </div>
                    </aside>
                )}

                <div className="browser-preview">
                    <div className="browser-toolbar">
                        <div className="browser-dots">
                            <span />
                            <span />
                            <span />
                        </div>

                        <div className="browser-address">
                            {previewUrl || "your url.."}
                        </div>

                        <button
                            className="refresh-butt"
                            type="button"
                            onClick={() => {
                                const currentUrl = previewUrl;
                                setPreview_Url("");
                                setTimeout(() => setPreview_Url(currentUrl), 50);
                                checkLinkStatus(currentUrl);
                            }}
                            disabled={!previewUrl}
                        >
                            Refresh
                        </button>
                    </div>

                    <div className="iframe-container" ref={containerRef}>
                        {previewUrl ? (
                            <div className="iframe-scale-wrapper" style={{ height: DESKTOP_HEIGHT * scale }}>
                                <iframe
                                    key={previewUrl}
                                    src={previewUrl}
                                    title="Project Live Preview"
                                    allow="clipboard-read; clipboard-write"
                                    style={{
                                        width: DESKTOP_WIDTH,
                                        height: DESKTOP_HEIGHT,
                                        transform: `scale(${scale})`,
                                        transformOrigin: "top left",
                                    }}
                                ></iframe>
                            </div>
                        ) : (
                            <div className="empty-preview">
                                <div className="empty-preview-icon" aria-hidden="true">
                                    <i className="fa-solid fa-eye-slash"></i>
                                </div>
                                <h2>No Live Preview Displayed</h2>
                                <p>
                                    Enter a Vercel, Netlify, or another deployed website URL to display.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </section>
    );
}

export default LivePreview;