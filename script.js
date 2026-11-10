(function () {
  "use strict";

  var FORMSUBMIT_ENDPOINT =
    "https://formsubmit.co/ajax/aishathshafaofficial@gmail.com";

  function formatSectionNumber(num, label) {
    var padded = String(num).padStart(2, "0");
    return "(" + padded + ") " + label;
  }

  function validateEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(String(email || "").trim());
  }

  function validateContactForm(data) {
    var errors = {};

    if (!data || !data.name || String(data.name).trim().length === 0) {
      errors.name = "Please enter your name";
    }

    if (!data || !data.email || String(data.email).trim().length === 0) {
      errors.email = "Please enter your email";
    } else if (!validateEmail(data.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!data || !data.message || String(data.message).trim().length === 0) {
      errors.message = "Please describe your project";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors: errors,
    };
  }

  function isKnownPath(pathname, protocol) {
    var normalized = String(pathname || "/").replace(/\/+$/, "") || "/";
    if (normalized === "/" || normalized === "/index.html") {
      return true;
    }
    if (protocol === "file:" && /\/index\.html$/i.test(normalized)) {
      return true;
    }
    return false;
  }

  function resolveErrorState(locationInfo) {
    var pathname = locationInfo && locationInfo.pathname ? locationInfo.pathname : "/";
    var search = locationInfo && locationInfo.search ? locationInfo.search : "";
    var protocol = locationInfo && locationInfo.protocol ? locationInfo.protocol : "";
    var params = new URLSearchParams(search);
    var errorParam = params.get("error");

    if (errorParam === "500") {
      return {
        isError: true,
        code: "500",
        label: "(500) Unexpected error",
        title: "Something went wrong.",
        statusText: "500 — Unexpected runtime error",
        message:
          "An unexpected issue occurred while loading this page. Try reloading, or return to the main portfolio.",
      };
    }

    if (errorParam === "404" || !isKnownPath(pathname, protocol)) {
      return {
        isError: true,
        code: "404",
        label: "(404) Page not found",
        title: "Page not found.",
        statusText: "404 — Route unavailable",
        message:
          "The page you are looking for may have been moved, renamed, or doesn’t exist. You can head back to the portfolio or write to me directly.",
      };
    }

    if (errorParam) {
      var displayCode = errorParam === "true" ? "Error" : errorParam;
      return {
        isError: true,
        code: displayCode,
        label: "(" + displayCode + ") Unexpected error",
        title: "Something went wrong.",
        statusText: displayCode + " — Unable to display page",
        message:
          "Something went wrong while displaying this page. You can reload or head back to the portfolio.",
      };
    }

    return { isError: false };
  }

  function shouldSkipPreloader(search) {
    if (typeof window !== "undefined" && window.matchMedia) {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return true;
      }
    }
    var params = new URLSearchParams(search || "");
    return params.get("skip-preloader") === "1" || params.get("autostart") === "1";
  }

  function initPageScrollbar() {
    var root = document.documentElement;
    var svgNamespace = "http://www.w3.org/2000/svg";
    var scrollbar = document.createElementNS(svgNamespace, "svg");
    var track = document.createElementNS(svgNamespace, "path");
    var thumb = document.createElementNS(svgNamespace, "path");
    var pathLength = 0;
    var thumbLength = 0;
    var draggingPointerId = null;
    var dragStartPointerY = 0;
    var dragStartScrollY = 0;
    var previousScrollBehavior = "";
    var inset = 8;
    var radius = 10;

    scrollbar.classList.add("page-scrollbar");
    scrollbar.setAttribute("aria-hidden", "true");
    track.classList.add("page-scrollbar-track");
    thumb.classList.add("page-scrollbar-thumb");
    scrollbar.appendChild(track);
    scrollbar.appendChild(thumb);
    document.body.appendChild(scrollbar);
    root.classList.add("has-custom-scrollbar");

    function getScrollMetrics() {
      var scrollHeight = Math.max(root.scrollHeight, document.body.scrollHeight);
      var viewportHeight = window.innerHeight;
      return {
        scrollHeight: scrollHeight,
        viewportHeight: viewportHeight,
        maxScroll: Math.max(0, scrollHeight - viewportHeight),
      };
    }

    function updateThumb() {
      if (!pathLength) return;

      var metrics = getScrollMetrics();
      var scrollRatio =
        metrics.maxScroll > 0
          ? Math.min(1, Math.max(0, window.scrollY / metrics.maxScroll))
          : 0;
      var startOffset = (pathLength - thumbLength) * scrollRatio;

      thumb.setAttribute(
        "stroke-dasharray",
        thumbLength + " " + Math.max(0, pathLength - thumbLength)
      );
      thumb.setAttribute("stroke-dashoffset", String(-startOffset));
      scrollbar.style.display = metrics.maxScroll > 0 ? "block" : "none";
    }

    function updatePath() {
      var width = window.innerWidth;
      var height = window.innerHeight;
      var edgeX = width - inset;
      var cornerX = edgeX - radius;
      var startX = Math.min(width * 0.91, cornerX);
      var topY = inset;
      var bottomY = height - inset;
      var effectiveRadius = Math.min(radius, Math.max(0, (height - inset * 2) / 2));
      var verticalStart = topY + effectiveRadius;
      var verticalEnd = bottomY - effectiveRadius;
      var pathData =
        "M " +
        startX +
        " " +
        topY +
        " L " +
        cornerX +
        " " +
        topY +
        " Q " +
        edgeX +
        " " +
        topY +
        " " +
        edgeX +
        " " +
        verticalStart +
        " L " +
        edgeX +
        " " +
        verticalEnd +
        " Q " +
        edgeX +
        " " +
        bottomY +
        " " +
        cornerX +
        " " +
        bottomY +
        " L " +
        startX +
        " " +
        bottomY;

      scrollbar.setAttribute("viewBox", "0 0 " + width + " " + height);
      track.setAttribute("d", pathData);
      thumb.setAttribute("d", pathData);
      pathLength = track.getTotalLength();

      thumbLength = pathLength * 0.62;
      updateThumb();
    }

    thumb.addEventListener("pointerdown", function (event) {
      if (event.button !== 0 && event.pointerType !== "touch") return;
      event.preventDefault();
      draggingPointerId = event.pointerId;
      dragStartPointerY = event.clientY;
      dragStartScrollY = window.scrollY;
      previousScrollBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      scrollbar.classList.add("is-dragging");
      thumb.setPointerCapture(event.pointerId);
    });

    thumb.addEventListener("pointermove", function (event) {
      if (event.pointerId !== draggingPointerId) return;
      var metrics = getScrollMetrics();
      var availableTrack = Math.max(1, window.innerHeight - inset * 2);
      var dragRange = Math.max(1, availableTrack - thumbLength);
      var scrollDelta =
        ((event.clientY - dragStartPointerY) / dragRange) * metrics.maxScroll;
      window.scrollTo(
        0,
        Math.min(metrics.maxScroll, Math.max(0, dragStartScrollY + scrollDelta))
      );
    });

    function stopDragging(event) {
      if (event.pointerId !== draggingPointerId) return;
      draggingPointerId = null;
      root.style.scrollBehavior = previousScrollBehavior;
      scrollbar.classList.remove("is-dragging");
      if (thumb.hasPointerCapture(event.pointerId)) {
        thumb.releasePointerCapture(event.pointerId);
      }
    }

    thumb.addEventListener("pointerup", stopDragging);
    thumb.addEventListener("pointercancel", stopDragging);
    window.addEventListener("scroll", updateThumb, { passive: true });
    window.addEventListener("resize", updatePath);
    window.addEventListener("load", updatePath, { once: true });

    if (typeof ResizeObserver !== "undefined") {
      var resizeObserver = new ResizeObserver(updatePath);
      resizeObserver.observe(root);
      resizeObserver.observe(document.body);
    }

    updatePath();
  }

  function splitHeadingWords(heading) {
    if (heading.getAttribute("data-words-split") === "true") {
      return Array.prototype.slice.call(heading.querySelectorAll(".word"));
    }

    var rawText = (heading.textContent || "").trim();
    if (!rawText) return [];

    heading.setAttribute("data-words-split", "true");
    var baseDelay = parseFloat(heading.getAttribute("data-base-delay") || "0");
    var words = rawText.split(/\s+/);
    heading.textContent = "";

    var wordEls = [];
    words.forEach(function (word, index) {
      var wrap = document.createElement("span");
      wrap.className = "word-wrap";

      var span = document.createElement("span");
      span.className = "word";
      span.textContent = word;
      span.style.setProperty(
        "--word-delay",
        Math.round((baseDelay + index * 0.045) * 1000) + "ms"
      );

      wrap.appendChild(span);
      heading.appendChild(wrap);
      wordEls.push(span);
    });

    return wordEls;
  }

  function initHeaderAnimation() {
    var header = document.querySelector(".header-animate");
    if (header) {
      requestAnimationFrame(function () {
        header.classList.add("is-visible");
      });
    }
  }

  function initAnimations() {
    initHeaderAnimation();

    var headings = document.querySelectorAll("[data-animate-heading]");
    headings.forEach(function (heading) {
      var parentError = heading.closest("#error-view");
      if (parentError && parentError.classList.contains("hidden")) {
        return;
      }
      var words = splitHeadingWords(heading);
      var isImmediate = heading.hasAttribute("data-animate-immediate");
      if (isImmediate) {
        requestAnimationFrame(function () {
          words.forEach(function (w) {
            w.classList.add("is-visible");
          });
        });
      }
    });

    var immediateItems = document.querySelectorAll("[data-animate-immediate]");
    immediateItems.forEach(function (el) {
      if (!el.hasAttribute("data-animate-heading")) {
        requestAnimationFrame(function () {
          el.classList.add("is-visible");
        });
      }
    });

    var scrollTargets = document.querySelectorAll(
      "[data-reveal], [data-animate-heading]:not([data-animate-immediate])"
    );

    if (typeof IntersectionObserver === "undefined") {
      scrollTargets.forEach(function (el) {
        if (el.hasAttribute("data-animate-heading")) {
          el.querySelectorAll(".word").forEach(function (w) {
            w.classList.add("is-visible");
          });
        } else {
          el.classList.add("is-visible");
        }
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var target = entry.target;

          if (target.hasAttribute("data-animate-heading")) {
            target.querySelectorAll(".word").forEach(function (w) {
              w.classList.add("is-visible");
            });
          } else {
            target.classList.add("is-visible");
          }

          observer.unobserve(target);
        });
      },
      {
        rootMargin: "0px 0px -30px 0px",
        threshold: 0.05,
      }
    );

    scrollTargets.forEach(function (el) {
      var parentError = el.closest("#error-view");
      if (parentError && parentError.classList.contains("hidden")) {
        return;
      }
      observer.observe(el);
    });
  }

  function dismissPreloaderImmediate(skipTransition) {
    var preloader = document.getElementById("preloader");
    if (preloader) {
      if (skipTransition) {
        preloader.classList.add("is-skipped");
      }
      preloader.classList.add("is-done");
      preloader.setAttribute("aria-hidden", "true");
    }
    if (document.body) {
      document.body.classList.remove("is-loading");
    }
  }

  function initPreloader(onComplete) {
    var preloader = document.getElementById("preloader");
    var counterEl = document.getElementById("preloader-counter");
    var barEl = document.getElementById("preloader-bar");
    var statusEl = document.getElementById("preloader-status");

    if (!preloader || shouldSkipPreloader(window.location.search)) {
      dismissPreloaderImmediate(true);
      if (onComplete) onComplete();
      return;
    }

    var startTime = performance.now();
    var minDuration = 850;
    var hardCap = 1600;
    var pageLoaded = document.readyState === "complete";
    var finished = false;
    var currentProgress = 0;

    if (!pageLoaded) {
      window.addEventListener(
        "load",
        function () {
          pageLoaded = true;
        },
        { once: true }
      );
    }

    function renderProgress(pct) {
      var rounded = Math.min(100, Math.max(0, Math.round(pct)));
      if (counterEl) {
        counterEl.textContent = String(rounded).padStart(2, "0") + "%";
      }
      if (barEl) {
        barEl.style.width = rounded + "%";
      }
      if (statusEl) {
        if (rounded < 40) {
          statusEl.textContent = "Initializing";
        } else if (rounded < 95) {
          statusEl.textContent = "Loading assets";
        } else {
          statusEl.textContent = "Ready";
        }
      }
    }

    function completePreloader() {
      if (finished) return;
      finished = true;
      renderProgress(100);
      setTimeout(function () {
        dismissPreloaderImmediate();
        setTimeout(function () {
          if (onComplete) onComplete();
        }, 160);
      }, 90);
    }

    function step(now) {
      if (finished) return;
      var elapsed = now - startTime;
      var canFinish = (pageLoaded && elapsed >= minDuration) || elapsed >= hardCap;

      if (canFinish) {
        currentProgress = currentProgress + (100 - currentProgress) * 0.35;
        if (currentProgress >= 99.2) {
          completePreloader();
          return;
        }
      } else {
        var t = Math.min(1, elapsed / minDuration);
        var eased = 1 - Math.pow(1 - t, 3);
        var target = Math.min(92, eased * 92);
        currentProgress = Math.max(currentProgress, target);
      }

      renderProgress(currentProgress);
      requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
    setTimeout(completePreloader, hardCap + 250);
  }

  function showErrorPage(details) {
    dismissPreloaderImmediate(true);

    var mainEl = document.getElementById("portfolio-main");
    var errorView = document.getElementById("error-view");
    var codeLabel = document.getElementById("error-code-label");
    var headingEl = document.getElementById("error-heading");
    var copyEl = document.getElementById("error-copy");
    var statusValueEl = document.getElementById("error-status-value");
    var pathValueEl = document.getElementById("error-path-value");

    if (mainEl) {
      mainEl.classList.add("hidden");
    }
    if (errorView) {
      errorView.classList.remove("hidden");
    }

    if (codeLabel && details.label) {
      codeLabel.textContent = details.label;
    }
    if (copyEl && details.message) {
      copyEl.textContent = details.message;
    }
    if (statusValueEl && details.statusText) {
      statusValueEl.textContent = details.statusText;
    }
    if (pathValueEl) {
      pathValueEl.textContent = window.location.pathname || "/";
    }

    if (headingEl) {
      if (details.title) {
        headingEl.removeAttribute("data-words-split");
        headingEl.textContent = details.title;
      }
      var words = splitHeadingWords(headingEl);
      requestAnimationFrame(function () {
        words.forEach(function (w) {
          w.classList.add("is-visible");
        });
      });
    }

    if (details.code && details.title) {
      document.title =
        details.code + " — " + details.title.replace(/\.$/, "") + " | Aishath Shafa";
    }
  }

  function bindErrorActions() {
    var reloadBtn = document.getElementById("error-reload-btn");
    if (reloadBtn) {
      reloadBtn.addEventListener("click", function () {
        window.location.reload();
      });
    }

    var pathValueEl = document.getElementById("error-path-value");
    if (pathValueEl && typeof window !== "undefined") {
      pathValueEl.textContent = window.location.pathname || "/";
    }
  }

  function buildFormSubmitPayload(data) {
    var name = String((data && data.name) || "").trim();
    var email = String((data && data.email) || "").trim();
    var company = String((data && data.company) || "").trim();
    var service = String((data && data.service) || "").trim();
    var message = String((data && data.message) || "").trim();

    return {
      name: name,
      email: email,
      company: company || "Not specified",
      service: service || "Not specified",
      message: message,
      _subject: "New portfolio inquiry from " + (name || "Visitor"),
      _template: "table",
      _captcha: "false",
    };
  }

  function submitContactMessage(data, fetchImpl) {
    var fetcher =
      fetchImpl || (typeof fetch !== "undefined" ? fetch.bind(window) : null);
    if (!fetcher) {
      return Promise.reject(
        new Error("Fetch API is unavailable in this environment.")
      );
    }

    var payload = buildFormSubmitPayload(data);

    return fetcher(FORMSUBMIT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    }).then(function (response) {
      return response
        .json()
        .catch(function () {
          return {};
        })
        .then(function (result) {
          var isFailure =
            !response.ok ||
            result.success === false ||
            result.success === "false";
          if (isFailure) {
            throw new Error(
              result.message || "Unable to send message right now."
            );
          }
          return result;
        });
    });
  }

  function initContactForm() {
    var form = document.getElementById("contact-form");
    var successPanel = document.getElementById("contact-success");
    var successText = document.getElementById("success-name-text");
    var resetBtn = document.getElementById("reset-form-btn");
    var submitBtn = document.getElementById("submit-btn");

    if (!form || !successPanel) return;

    var nameInput = document.getElementById("contact-name");
    var emailInput = document.getElementById("contact-email");
    var companyInput = document.getElementById("contact-company");
    var serviceInput = document.getElementById("contact-service");
    var messageInput = document.getElementById("contact-message");
    var honeyInput = form.querySelector('input[name="_honey"]');

    var nameError = document.getElementById("error-name");
    var emailError = document.getElementById("error-email");
    var messageError = document.getElementById("error-message");
    var submitError = document.getElementById("form-submit-error");

    var defaultBtnHTML = submitBtn ? submitBtn.innerHTML : "";

    function clearFieldError(input, errorEl) {
      if (input) input.classList.remove("is-error");
      if (errorEl) {
        errorEl.textContent = "";
        errorEl.classList.add("hidden");
      }
    }

    function setFieldError(input, errorEl, msg) {
      if (msg) {
        if (input) input.classList.add("is-error");
        if (errorEl) {
          errorEl.textContent = msg;
          errorEl.classList.remove("hidden");
        }
      } else {
        clearFieldError(input, errorEl);
      }
    }

    function clearSubmitError() {
      if (submitError) {
        submitError.textContent = "";
        submitError.classList.add("hidden");
      }
    }

    if (nameInput) {
      nameInput.addEventListener("input", function () {
        clearSubmitError();
        if (!nameInput.classList.contains("is-error")) return;
        clearFieldError(nameInput, nameError);
      });
    }
    if (emailInput) {
      emailInput.addEventListener("input", function () {
        clearSubmitError();
        if (!emailInput.classList.contains("is-error")) return;
        clearFieldError(emailInput, emailError);
      });
    }
    if (messageInput) {
      messageInput.addEventListener("input", function () {
        clearSubmitError();
        if (!messageInput.classList.contains("is-error")) return;
        clearFieldError(messageInput, messageError);
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearSubmitError();

      if (honeyInput && honeyInput.value) {
        return;
      }

      var data = {
        name: nameInput ? nameInput.value : "",
        email: emailInput ? emailInput.value : "",
        company: companyInput ? companyInput.value : "",
        service: serviceInput ? serviceInput.value : "",
        message: messageInput ? messageInput.value : "",
      };

      var validation = validateContactForm(data);
      setFieldError(nameInput, nameError, validation.errors.name);
      setFieldError(emailInput, emailError, validation.errors.email);
      setFieldError(messageInput, messageError, validation.errors.message);

      if (!validation.isValid) {
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = "<span>Sending message...</span>";
      }

      submitContactMessage(data)
        .then(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = defaultBtnHTML;
          }
          if (successText) {
            var trimmedName = data.name.trim() || "there";
            successText.textContent =
              "Thank you, " +
              trimmedName +
              ". I received your note and will get back to you within two working days.";
          }
          form.classList.add("hidden");
          successPanel.classList.remove("hidden");
        })
        .catch(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = defaultBtnHTML;
          }
          if (submitError) {
            submitError.textContent =
              "Could not send your message right now. Please try again or email aishathshafaofficial@gmail.com directly.";
            submitError.classList.remove("hidden");
          }
        });
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        form.reset();
        clearSubmitError();
        clearFieldError(nameInput, nameError);
        clearFieldError(emailInput, emailError);
        clearFieldError(messageInput, messageError);
        successPanel.classList.add("hidden");
        form.classList.remove("hidden");
      });
    }
  }

  function initOsLightbox() {
    var lightbox = document.getElementById("os-lightbox");
    var openBtn = document.getElementById("open-os-preview-btn");
    var thumbBtn = document.getElementById("os-preview-thumb-btn");
    var closeBtn = document.getElementById("close-os-lightbox-btn");
    var backdrop = document.getElementById("os-lightbox-backdrop");

    if (!lightbox) return;

    function openLightbox() {
      lightbox.classList.remove("hidden");
      document.body.classList.add("is-loading");
      if (closeBtn) closeBtn.focus();
    }

    function closeLightbox() {
      lightbox.classList.add("hidden");
      document.body.classList.remove("is-loading");
    }

    if (openBtn) openBtn.addEventListener("click", openLightbox);
    if (thumbBtn) thumbBtn.addEventListener("click", openLightbox);
    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
    if (backdrop) backdrop.addEventListener("click", closeLightbox);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !lightbox.classList.contains("hidden")) {
        closeLightbox();
      }
    });
  }

  function bootstrap() {
    bindErrorActions();
    initPageScrollbar();

    var isStaticErrorPage =
      document.body && document.body.getAttribute("data-page") === "error";

    if (isStaticErrorPage) {
      initHeaderAnimation();
      var errorHeading = document.getElementById("error-heading");
      if (errorHeading) {
        var words = splitHeadingWords(errorHeading);
        requestAnimationFrame(function () {
          words.forEach(function (w) {
            w.classList.add("is-visible");
          });
        });
      }
      initAnimations();
      return;
    }

    var errorState = resolveErrorState({
      pathname: window.location.pathname,
      search: window.location.search,
      protocol: window.location.protocol,
    });

    if (errorState.isError) {
      document
        .querySelectorAll('.site-nav a[href^="#"]')
        .forEach(function (link) {
          var hash = link.getAttribute("href");
          link.setAttribute("href", "./index.html" + hash);
        });
      initHeaderAnimation();
      showErrorPage(errorState);
      initAnimations();
      return;
    }

    initContactForm();
    initOsLightbox();
    initPreloader(function () {
      initAnimations();
    });
  }

  if (typeof window !== "undefined") {
    window.addEventListener("error", function (event) {
      if (event && event.error && document.getElementById("error-view")) {
        initHeaderAnimation();
        showErrorPage({
          code: "500",
          label: "(500) Unexpected error",
          title: "Something went wrong.",
          statusText: "500 — Unexpected runtime error",
          message:
            "An unexpected issue occurred while rendering this page. You can reload or head back to the portfolio.",
        });
      }
    });
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", bootstrap);
    } else {
      bootstrap();
    }
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      FORMSUBMIT_ENDPOINT: FORMSUBMIT_ENDPOINT,
      formatSectionNumber: formatSectionNumber,
      validateEmail: validateEmail,
      validateContactForm: validateContactForm,
      buildFormSubmitPayload: buildFormSubmitPayload,
      submitContactMessage: submitContactMessage,
      isKnownPath: isKnownPath,
      resolveErrorState: resolveErrorState,
    };
  }
})();
