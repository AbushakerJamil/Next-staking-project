"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

const ToastContext = createContext();

const COLORS = {
  processing: {
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    border: "#667eea",
    icon: "⏳",
  },
  approve: {
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    border: "#f093fb",
    icon: "✓",
  },
  complete: {
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    border: "#4facfe",
    icon: "🎉",
  },
  success: {
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    border: "#43e97b",
    icon: "✅",
  },
  reject: {
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    border: "#fa709a",
    icon: "❌",
  },
  failed: {
    gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    border: "#ff9a9e",
    icon: "⚠️",
  },
  error: {
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    border: "#f093fb",
    icon: "🚫",
  },
  info: {
    gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    border: "#a8edea",
    icon: "ℹ️",
  },
  warning: {
    gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    border: "#fcb69f",
    icon: "⚡",
  },
};

const TOAST_STYLE = {
  base: {
    minWidth: "300px",
    maxWidth: "500px",
    padding: "16px 20px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "500",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(10px)",
    color: "white",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
};

const createToastStyle = (type) => ({
  ...TOAST_STYLE.base,
  background: COLORS[type].gradient,
  borderLeft: `4px solid ${COLORS[type].border}`,
});

export const ToastProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const showProcessing = (message) => {
    return toast.loading(message, {
      style: createToastStyle("processing"),
      icon: COLORS.processing.icon,
    });
  };

  const showApprove = (message) => {
    return toast.success(message, {
      style: createToastStyle("approve"),
      icon: COLORS.approve.icon,
      duration: 5000,
    });
  };

  const showComplete = (message) => {
    return toast.success(message, {
      style: createToastStyle("complete"),
      icon: COLORS.complete.icon,
      duration: 5000,
    });
  };

  const showSuccess = (message) => {
    return toast.success(message, {
      style: createToastStyle("success"),
      icon: COLORS.success.icon,
      duration: 5000,
    });
  };

  const showReject = (message) => {
    return toast.error(message, {
      style: createToastStyle("reject"),
      icon: COLORS.reject.icon,
      duration: 5000,
    });
  };

  const showFailed = (message) => {
    return toast.error(message, {
      style: createToastStyle("failed"),
      icon: COLORS.failed.icon,
      duration: 5000,
    });
  };

  const showError = (message) => {
    return toast.error(message, {
      style: createToastStyle("error"),
      icon: COLORS.error.icon,
      duration: 5000,
    });
  };

  const showInfo = (message) => {
    return toast(message, {
      style: createToastStyle("info"),
      icon: COLORS.info.icon,
      duration: 4000,
    });
  };

  const showWarning = (message) => {
    return toast(message, {
      style: createToastStyle("warning"),
      icon: COLORS.warning.icon,
      duration: 4000,
    });
  };

  const updateToast = (id, state, message) => {
    toast.dismiss(id);

    switch (state) {
      case "processing":
        return showProcessing(message);
      case "approve":
        return showApprove(message);
      case "complete":
        return showComplete(message);
      case "success":
        return showSuccess(message);
      case "reject":
        return showReject(message);
      case "failed":
        return showFailed(message);
      case "error":
        return showError(message);
      case "warning":
        return showWarning(message);
      case "info":
      default:
        return showInfo(message);
    }
  };

  const notify = {
    start: (message = "Processing transaction...") => {
      return showProcessing(message);
    },
    update: (id, state, message) => {
      return updateToast(id, state, message);
    },
    approve: (id, message = "Transaction Approved!") => {
      return updateToast(id, "approve", message);
    },
    complete: (id, message = "Transaction completed successfully!") => {
      return updateToast(id, "complete", message);
    },
    success: (id, message = "Success!") => {
      return updateToast(id, "success", message);
    },
    reject: (id, message = "Transaction rejected!") => {
      return updateToast(id, "reject", message);
    },
    fail: (id, message = "Transaction failed!") => {
      return updateToast(id, "failed", message);
    },
    error: (id, message = "An error occurred!") => {
      return updateToast(id, "error", message);
    },
    warning: (id, message = "Warning!") => {
      return updateToast(id, "warning", message);
    },
    info: (id, message = "Information") => {
      return updateToast(id, "info", message);
    },
  };

  const contextValue = {
    notify,
    showProcessing,
    showApprove,
    showComplete,
    showSuccess,
    showReject,
    showFailed,
    showError,
    showInfo,
    showWarning,
    updateToast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      <div
        style={{
          position: "fixed",
          ...(isMobile
            ? {
                top: "10px",
                left: "50%",
                transform: "translateX(-50%)",
              }
            : {
                bottom: "80%",
                left: "20px",
              }),
          zIndex: 9999,
        }}
      >
        <Toaster
          position={isMobile ? "top-center" : "bottom-left"}
          reverseOrder={false}
          gutter={8}
          containerStyle={{
            position: "static",
            ...(isMobile && {
              maxWidth: "calc(100vw - 20px)",
            }),
          }}
          toastOptions={{
            duration: 5000,
            style: {
              background: "#fff",
              color: "#363636",
              ...(isMobile && {
                minWidth: "280px",
                maxWidth: "calc(100vw - 40px)",
                fontSize: "13px",
                padding: "12px 16px",
              }),
            },
            success: {
              duration: 5000,
              iconTheme: {
                primary: "#43e97b",
                secondary: "#fff",
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: "#f5576c",
                secondary: "#fff",
              },
            },
            loading: {
              iconTheme: {
                primary: "#667eea",
                secondary: "#fff",
              },
            },
          }}
        />
      </div>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
};
