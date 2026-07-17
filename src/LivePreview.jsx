import { useState } from "react";
import "./LivePreview.css";

function LivePreview() {
    const [inputUrl, setInput_Url] = useState("");
    const [previewUrl, setPreview_Url] = useState("");
    const [view_Mode, setView_Mode] = useState("preview");
    const [message, set_Message] = useState("");

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

    const loadPreview = () => {
        const formatted_Url = format_Url(inputUrl);

        if (!formatted_Url) {
            set_Message("* Enter valid preview link");
            return;
        }

        setPreview_Url(formatted_Url);
        set_Message("");
    };

    const clearInput = () => {
        setInput_Url("");
        setPreview_Url("");
        set_Message("");
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
        <main className="live-preview-page">
            <header className="preview-header">
                <div>
                    <p className="preview-label">STREAMLINE</p>
                    <h1>LIVE PREVIEW</h1>
                    <p>View and test your project more easily.</p>
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

                                    if (newUrl.trim() && message === "Enter valid preview link") {
                                        set_Message("");
                                    }

                                    if (newUrl.trim() === ""){
                                      setPreview_Url("");
                                      set_Message("");
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
                            <strong className="status-ready">Ready</strong>
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
                            }}
                            disabled={!previewUrl}
                        >
                            Refresh
                        </button>
                    </div>

                    <div className="iframe-container">
                        {previewUrl ? (
                            <iframe
                                key={previewUrl}
                                src={previewUrl}
                                title="Project Live Preview"
                                allow="clipboard-read; clipboard-write"
                            ></iframe>
                        ) : (
                            <div className="empty-preview">
                                <div className="empty-preview-icon" aria-hidden="true">
                                    <i class="fa-solid fa-eye-slash"></i>
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
        </main>
    );
}

export default LivePreview;