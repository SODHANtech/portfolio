import { useState } from "react";
import api from "../services/api";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("IDLE"); // IDLE, SENDING, SUCCESS, ERROR
  const [terminalLogs, setTerminalLogs] = useState(["CONSOLE_READY: COM_LINK_ONLINE"]);
  const [validationError, setValidationError] = useState("");

  const addLog = (msg) => {
    setTerminalLogs((prev) => [...prev, `> ${msg}`].slice(-4)); // keep last 4 log lines
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setValidationError("PLEASE COMPLETE ALL REQUIRED CONFIGURATION FIELDS.");
      addLog("VALIDATION_ERROR: EMPTY_FIELDS_DETECTED");
      return;
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setValidationError("INVALID COM_ADDRESS ROUTE.");
      addLog("VALIDATION_ERROR: INVALID_EMAIL_FORMAT");
      return;
    }

    setStatus("SENDING");
    setValidationError("");
    addLog("COM_LINK: DISPATCHING_PACKETS...");

    try {
      await api.post("/contact", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });
      setStatus("SUCCESS");
      addLog("TRANSMISSION_COMPLETE: SUCCESS_201");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("ERROR");
      const errMsg = err.response?.data?.message || "TRANSMISSION_FAILURE";
      setValidationError(errMsg.toUpperCase());
      addLog("COM_LINK_FAILURE: SERVER_DISCONNECT");
    }
  };

  return (
    <div className="contact-form-hud hud-panel">
      <div className="hud-panel-header">
        <span>TACTICAL_COMMUNICATION_LINK</span>
        <span className={status === "SUCCESS" ? "glow-green" : status === "ERROR" ? "glow-red" : "glow-cyan"}>
          {status}
        </span>
      </div>

      <div className="hud-panel-content">
        <form onSubmit={handleSubmit} className="hud-contact-form">
          <div className="form-group-hud">
            <label htmlFor="contact-name">IDENTIFIER_NAME *</label>
            <input
              type="text"
              id="contact-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Recruiter Name"
              required
              disabled={status === "SENDING"}
            />
          </div>

          <div className="form-group-hud">
            <label htmlFor="contact-email">COM_ADDRESS_EMAIL *</label>
            <input
              type="email"
              id="contact-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@company.com"
              required
              disabled={status === "SENDING"}
            />
          </div>

          <div className="form-group-hud">
            <label htmlFor="contact-subject">TRANSMISSION_SUBJECT</label>
            <input
              type="text"
              id="contact-subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="General Inquiry"
              disabled={status === "SENDING"}
            />
          </div>

          <div className="form-group-hud full-width">
            <label htmlFor="contact-message">PACKET_PAYLOAD_MESSAGE *</label>
            <textarea
              id="contact-message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              placeholder="Type your message here..."
              required
              disabled={status === "SENDING"}
            />
          </div>

          {validationError && (
            <div className="form-error-hud glow-red text-center">
              {validationError}
            </div>
          )}

          {status === "SUCCESS" && (
            <div className="form-success-hud glow-green text-center">
              TRANSMISSION RECEIVED. PACKETS SAVED SECURELY.
            </div>
          )}

          <div className="form-actions-hud">
            {/* Terminal status readout */}
            <div className="form-terminal-logs">
              {terminalLogs.map((log, idx) => (
                <div key={idx} className="terminal-log-line">
                  {log}
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="primary-button submit-btn"
              disabled={status === "SENDING"}
            >
              {status === "SENDING" ? "TRANSMITTING..." : "DISPATCH_MESSAGE"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
