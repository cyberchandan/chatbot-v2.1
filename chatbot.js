(function() {
    // Flowchart State Machine Definition
    const ChatFlow = {
        welcome: {
            text: () => "Welcome to the Embassy of India, Kathmandu. Got any question?",
            options: [
                { text: "Yes", next: "ask_name" },
                { text: "No", next: "goodbye" }
            ]
        },
        goodbye: {
            text: () => "Thank you for visiting. Have a good day!",
            onEnter: (state) => {
                // Auto reset back to welcome after 10 seconds of inactivity
                state.resetTimer = setTimeout(() => {
                    state.restart();
                }, 10000);
            },
            options: [
                { text: "Start Over", next: "welcome", class: "alt-option" }
            ]
        },
        ask_name: {
            text: () => "Before we get started, what's your name?",
            inputType: "text",
            inputPlaceholder: "Type your name here...",
            next: (name, state) => {
                state.userName = name.trim() || "Visitor";
                return "services";
            }
        },
        services: {
            text: (state) => `Hello ${state.userName}! Please Select Service below:`,
            options: [
                { text: "3rd Country Travel NOC", next: "noc_options" },
                { text: "Embassy Registration for Indian Nationals", next: "reg_options" }
            ]
        },
        noc_options: {
            text: () => "You selected 3rd Country Travel NOC. Please choose the specific query details:",
            options: [
                { text: "i) Do you need No Objection Certificate (NOC) to travel from Nepal to a third country?", next: "noc_option1" },
                { text: "ii) Who is exempted from requirement of travel NOC?", next: "noc_option2" }
            ]
        },
        noc_option1: {
            text: () => "<strong>Option 1:</strong> Please visit following link for more details:<br>" +
                   "<a href='https://www.indembkathmandu.gov.in/latest-advisory-regarding-consular-services' target='_blank' rel='noopener'>" +
                   "https://www.indembkathmandu.gov.in/latest-advisory-regarding-consular-services</a>" +
                   "<br><br>Any other query?",
            options: [
                { text: "Yes", next: "services" },
                { text: "No", next: "goodbye" }
            ]
        },
        noc_option2: {
            text: () => "<strong>Option 2:</strong><br>" +
                   "i) Diplomatic Passport holders<br>" +
                   "ii) Minors under age of 10 years<br>" +
                   "iii) Transit passengers who will not cross Nepal immigration" +
                   "<br><br>Any other query?",
            options: [
                { text: "Yes", next: "services" },
                { text: "No", next: "goodbye" }
            ]
        },
        reg_options: {
            text: () => "You selected Embassy Registration for Indian Nationals. Please choose registration type:",
            options: [
                { text: "i) First-time Registration", next: "reg_option1" },
                { text: "ii) Renewal/Loss of Old Registration", next: "reg_option2" },
                { text: "iii) Form for Registration", next: "reg_option3" }
            ]
        },
        reg_option1: {
            text: () => "<strong>Option 1:</strong> Please visit Embassy of India, Kathmandu with following documents:<br>" +
                   "1) Passport/ voter ID issued by Election Commission of India or In case of minor-Birth certificate of the Child a/w parents proof of Indian Nationality<br>" +
                   "2) Residence proof" +
                   "<br><br>Any other query?",
            options: [
                { text: "Yes", next: "services" },
                { text: "No", next: "goodbye" }
            ]
        },
        reg_option2: {
            text: () => "<strong>Option 2:</strong> Please visit Embassy of India, Kathmandu with following documents:<br>" +
                   "1) Passport/ voter ID issued by Election Commission of India or In case of minor-Birth certificate of the Child a/w parents proof of Indian Nationality<br>" +
                   "2) Residence proof<br>" +
                   "3) Old Registration or FIR Copy of lost report (in case of Loss)<br>" +
                   "4) Fees - NPR 3290/-" +
                   "<br><br>Any other query?",
            options: [
                { text: "Yes", next: "services" },
                { text: "No", next: "goodbye" }
            ]
        },
        reg_option3: {
            text: () => "<strong>Option 3:</strong> Please fill form and take print out from this link:<br>" +
                   "<a href='https://www.indembkathmandu.gov.in/student-registrationNationality' target='_blank' rel='noopener'>" +
                   "https://www.indembkathmandu.gov.in/student-registrationNationality</a>" +
                   "<br><br>Any other query?",
            options: [
                { text: "Yes", next: "services" },
                { text: "No", next: "goodbye" }
            ]
        }
    };

    // Chatbot Engine State
    const ChatbotState = {
        currentState: "welcome",
        userName: "",
        isOpen: true,
        hasOpenedOnce: true,
        resetTimer: null,

        // DOM elements cache
        el: {
            widget: null,
            trigger: null,
            badge: null,
            window: null,
            messages: null,
            input: null,
            send: null,
            close: null
        },

        init() {
            this.injectHTML();
            this.cacheDOM();
            this.bindEvents();
            this.startFlow();
            this.openWindow();
        },

        injectHTML() {
            // Check if widget container already exists on the page
            let container = document.getElementById("indian-embassy-chatbot-root");
            if (!container) {
                container = document.createElement("div");
                container.id = "indian-embassy-chatbot-root";
                document.body.appendChild(container);
            }

            container.innerHTML = `
                <div class="ie-chatbot-widget">
                    <!-- Chat Window Container -->
                    <div class="ie-chatbot-window active" id="ie-chatbot-window">
                        <!-- Indian Flag Color Stripes -->
                        <div class="ie-chatbot-stripe">
                            <div class="ie-chatbot-stripe-saffron"></div>
                            <div class="ie-chatbot-stripe-white"></div>
                            <div class="ie-chatbot-stripe-green"></div>
                        </div>

                        <!-- Chat Header -->
                        <div class="ie-chatbot-header">
                            <div class="ie-chatbot-header-info">
                                <div class="ie-chatbot-avatar-container">
                                    <svg class="ie-chatbot-avatar-img" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="50" cy="50" r="46" fill="#ffffff" stroke="#000080" stroke-width="2.5"/>
                                        <!-- Styled representation of Ashoka Chakra / Wheel -->
                                        <circle cx="50" cy="50" r="14" fill="none" stroke="#000080" stroke-width="2"/>
                                        <circle cx="50" cy="50" r="28" fill="none" stroke="#000080" stroke-width="1.5" stroke-dasharray="2,2"/>
                                        <!-- 24 Spokes representation -->
                                        <path d="M50 4 L50 96 M4 50 L96 50 M17.5 17.5 L82.5 82.5 M17.5 82.5 L82.5 17.5" stroke="#000080" stroke-width="0.75"/>
                                        <path d="M27.5 38.5 L72.5 61.5 M27.5 61.5 L72.5 38.5 M38.5 27.5 L61.5 72.5 M61.5 27.5 L38.5 72.5" stroke="#000080" stroke-width="0.75"/>
                                        <circle cx="50" cy="50" r="3" fill="#000080"/>
                                    </svg>
                                    <div class="ie-chatbot-status-dot"></div>
                                </div>
                                <div class="ie-chatbot-header-text">
                                    <h3>Embassy of India</h3>
                                    <p>Kathmandu, Nepal • Online</p>
                                </div>
                            </div>
                            <!-- Restart Button -->
                            <button class="ie-chatbot-restart-btn" id="ie-chatbot-restart" aria-label="Restart Conversation">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                                </svg>
                            </button>
                        </div>

                        <!-- Chat Messages Screen -->
                        <div class="ie-chatbot-messages" id="ie-chatbot-messages"></div>

                        <!-- Chat Input Footer -->
                        <div class="ie-chatbot-footer">
                            <div class="ie-chatbot-input-container">
                                <input type="text" class="ie-chatbot-input" id="ie-chatbot-input" placeholder="Please select options or answer bot..." disabled>
                                <button class="ie-chatbot-send-btn" id="ie-chatbot-send" aria-label="Send message" disabled>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                                    </svg>
                                </button>
                            </div>
                            <div class="ie-chatbot-branding">
                                Consular Assistant Chatbot • <span>EOI Kathmandu</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        cacheDOM() {
            this.el.widget = document.querySelector(".ie-chatbot-widget");
            this.el.trigger = document.getElementById("ie-chatbot-trigger");
            this.el.badge = document.getElementById("ie-chatbot-badge");
            this.el.window = document.getElementById("ie-chatbot-window");
            this.el.messages = document.getElementById("ie-chatbot-messages");
            this.el.input = document.getElementById("ie-chatbot-input");
            this.el.send = document.getElementById("ie-chatbot-send");
            this.el.close = document.getElementById("ie-chatbot-close");
            this.el.restart = document.getElementById("ie-chatbot-restart");
            this.el.iconChat = document.getElementById("ie-icon-chat");
            this.el.iconClose = document.getElementById("ie-icon-close");
        },

        bindEvents() {
            // Trigger bubble click handler (if trigger exists)
            if (this.el.trigger) {
                this.el.trigger.addEventListener("click", () => this.toggleWindow());
            }
            
            // Close button click handler (if close button exists)
            if (this.el.close) {
                this.el.close.addEventListener("click", () => this.closeWindow());
            }

            // Restart button click handler
            if (this.el.restart) {
                this.el.restart.addEventListener("click", () => this.restart());
            }

            // Handle typing and sending name input
            if (this.el.input) {
                this.el.input.addEventListener("input", () => {
                    if (this.el.send) {
                        this.el.send.disabled = !this.el.input.value.trim();
                    }
                });

                this.el.input.addEventListener("keydown", (e) => {
                    if (e.key === "Enter" && this.el.input.value.trim() && !this.el.input.disabled) {
                        this.handleTextInputSubmit();
                    }
                });
            }

            if (this.el.send) {
                this.el.send.addEventListener("click", () => {
                    if (this.el.input && this.el.input.value.trim() && !this.el.input.disabled) {
                        this.handleTextInputSubmit();
                    }
                });
            }
        },

        toggleWindow() {
            if (this.isOpen) {
                this.closeWindow();
            } else {
                this.openWindow();
            }
        },

        openWindow() {
            this.isOpen = true;
            if (this.el.window) this.el.window.classList.add("active");
            if (this.el.trigger) this.el.trigger.classList.add("active");
            if (this.el.iconChat) this.el.iconChat.style.display = "none";
            if (this.el.iconClose) this.el.iconClose.style.display = "block";
            
            // Hide notification badge once opened
            if (!this.hasOpenedOnce) {
                this.hasOpenedOnce = true;
                if (this.el.badge) this.el.badge.style.display = "none";
            }
            
            this.scrollToBottom();
            
            // Set focus on input if enabled
            if (this.el.input && !this.el.input.disabled) {
                this.el.input.focus();
            }
        },

        closeWindow() {
            this.isOpen = false;
            if (this.el.window) this.el.window.classList.remove("active");
            if (this.el.trigger) this.el.trigger.classList.remove("active");
            if (this.el.iconChat) this.el.iconChat.style.display = "block";
            if (this.el.iconClose) this.el.iconClose.style.display = "none";
        },

        startFlow() {
            this.currentState = "welcome";
            this.renderState();
        },

        restart() {
            if (this.resetTimer) {
                clearTimeout(this.resetTimer);
                this.resetTimer = null;
            }
            if (this.el.messages) this.el.messages.innerHTML = "";
            this.userName = "";
            this.currentState = "welcome";
            this.renderState();
        },

        renderState() {
            const stateDef = ChatFlow[this.currentState];
            if (!stateDef) return;

            // Clear any active timers on render
            if (this.resetTimer) {
                clearTimeout(this.resetTimer);
                this.resetTimer = null;
            }

            // Show typing indicator
            this.showTypingIndicator();

            // Simulate natural delay for bot response
            setTimeout(() => {
                this.hideTypingIndicator();
                
                // Add Bot message
                const messageText = typeof stateDef.text === "function" ? stateDef.text(this) : stateDef.text;
                this.addBotMessage(messageText);

                // Setup user action response (options or text input)
                if (stateDef.inputType === "text") {
                    this.enableTextInput(stateDef.inputPlaceholder || "Type here...");
                } else if (stateDef.options && stateDef.options.length > 0) {
                    this.disableTextInput("Please select an option Above...");
                    this.addQuickOptions(stateDef.options);
                }

                // Check for lifecycle hooks
                if (typeof stateDef.onEnter === "function") {
                    stateDef.onEnter(this);
                }
            }, 800);
        },

        addBotMessage(text) {
            const wrapper = document.createElement("div");
            wrapper.className = "ie-chatbot-msg-wrapper bot";
            
            // Format time string
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            wrapper.innerHTML = `
                <div class="ie-chatbot-msg-avatar">
                    IN
                </div>
                <div class="ie-chatbot-msg-bubble">
                    ${text}
                    <span class="ie-chatbot-msg-time">${timeString}</span>
                </div>
            `;
            this.el.messages.appendChild(wrapper);
            this.scrollToBottom();
        },

        addUserMessage(text) {
            const wrapper = document.createElement("div");
            wrapper.className = "ie-chatbot-msg-wrapper user";

            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            wrapper.innerHTML = `
                <div class="ie-chatbot-msg-bubble">
                    ${text}
                    <span class="ie-chatbot-msg-time">${timeString}</span>
                </div>
            `;
            this.el.messages.appendChild(wrapper);
            this.scrollToBottom();
        },

        showTypingIndicator() {
            const wrapper = document.createElement("div");
            wrapper.className = "ie-chatbot-msg-wrapper bot ie-chatbot-typing-wrapper";
            wrapper.innerHTML = `
                <div class="ie-chatbot-msg-avatar">
                    IN
                </div>
                <div class="ie-chatbot-msg-bubble ie-chatbot-typing-bubble">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            `;
            this.el.messages.appendChild(wrapper);
            this.scrollToBottom();
        },

        hideTypingIndicator() {
            const typingWrapper = this.el.messages.querySelector(".ie-chatbot-typing-wrapper");
            if (typingWrapper) {
                typingWrapper.remove();
            }
        },

        addQuickOptions(options) {
            const container = document.createElement("div");
            container.className = "ie-chatbot-options-container";

            options.forEach(opt => {
                const btn = document.createElement("button");
                btn.className = "ie-chatbot-option-btn";
                if (opt.class) {
                    btn.classList.add(opt.class);
                }
                btn.innerHTML = opt.text;
                
                // Event listener on select
                btn.addEventListener("click", () => {
                    this.handleOptionSelect(opt);
                });
                
                container.appendChild(btn);
            });

            this.el.messages.appendChild(container);
            this.scrollToBottom();
        },

        handleOptionSelect(option) {
            // Disable all buttons in the last options container
            const activeOptionsContainer = this.el.messages.querySelector(".ie-chatbot-options-container:last-of-type");
            if (activeOptionsContainer) {
                const buttons = activeOptionsContainer.querySelectorAll("button");
                buttons.forEach(btn => {
                    btn.disabled = true;
                    btn.style.opacity = "0.5";
                    btn.style.cursor = "default";
                    btn.style.transform = "none";
                    btn.style.pointerEvents = "none";
                });
            }

            // Display user message bubble, stripping order numbering (e.g., "i)", "ii)", "1)")
            const cleanText = option.text.replace(/^(?:[a-zA-Z0-9]+[\)\.]\s*)/, '');
            this.addUserMessage(cleanText);

            // Move to next state
            setTimeout(() => {
                this.currentState = option.next;
                this.renderState();
            }, 400);
        },

        enableTextInput(placeholder) {
            this.el.input.disabled = false;
            this.el.input.placeholder = placeholder;
            this.el.input.value = "";
            this.el.send.disabled = true;
            if (this.isOpen) {
                this.el.input.focus();
            }
        },

        disableTextInput(placeholder) {
            this.el.input.disabled = true;
            this.el.input.placeholder = placeholder;
            this.el.input.value = "";
            this.el.send.disabled = true;
        },

        handleTextInputSubmit() {
            const value = this.el.input.value.trim();
            if (!value) return;

            // Disable input while processing
            this.disableTextInput("Processing...");

            // Display user message bubble
            this.addUserMessage(value);

            // Fetch state definition to determine routing
            const stateDef = ChatFlow[this.currentState];
            
            setTimeout(() => {
                if (typeof stateDef.next === "function") {
                    this.currentState = stateDef.next(value, this);
                } else {
                    this.currentState = stateDef.next;
                }
                this.renderState();
            }, 400);
        },

        scrollToBottom() {
            this.el.messages.scrollTop = this.el.messages.scrollHeight;
        }
    };

    // Auto-initialize when the DOM is fully loaded
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => ChatbotState.init());
    } else {
        ChatbotState.init();
    }
})();
