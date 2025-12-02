function matchRecursion(reg,str)
{
    var i = str.match(reg);
    if(i && i[1]) return str = str.replace(reg,""),[i[1]].concat(matchRecursion(reg,str));
    else return [];
}

function replaceRecursion(reg,str)
{
    var i = str.match(reg);
    if(i && i[1]) return str = str.replace(reg,""),replaceRecursion(reg,str);
    else return str;
}

function parseElement(htmlString)
{
    return new DOMParser().parseFromString(htmlString,'text/html').body.childNodes[0];
}

const Callout =
{
    init: function() {
        // 添加 FontAwesome
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css';
        document.head.appendChild(link);

        // 添加 CSS
        const style = document.createElement('style');
        style.textContent = `
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            padding: 20px;
        }

        .callout {
            border-radius: 8px;
            margin-bottom: 20px;
            padding: 0;
            position: relative;
            transition: all 0.3s ease;
            overflow: hidden;
        }

        .callout-header {
            display: flex;
            align-items: center;
            cursor: pointer;
            padding: 16px;
        }

        .callout-icon {
            width: 24px;
            height: 24px;
            margin-right: 8px;
            flex-shrink: 0;
        }

        .callout-title {
            font-weight: bold;
            flex-grow: 1;
        }

        .callout-content {
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 1;
            transform: translateY(0);
            max-height: 10000px;
            padding: 0 16px 16px;
        }

        .callout-collapsed .callout-content {
            max-height: 0;
            opacity: 0;
            transform: translateY(-10px);
            padding-top: 0;
            padding-bottom: 0;
            margin: 0;
        }

        .callout-toggle {
            margin-left: auto;
            font-size: 16px;
            line-height: 1;
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            user-select: none;
            flex-shrink: 0;
        }

        .callout-collapsed .callout-toggle {
            transform: rotate(-90deg);
        }

        .callout {
            margin-left: 20px;
        }
        `;
        document.head.appendChild(style);

        this.createBlockquotes();
    },

    // 和obsidian相同
    getType: function(typeName) {
        typeName = typeName.toLowerCase();

        if (["note"].includes(typeName)) return "NOTE";
        else if (["abstract", "summary", "tldr"].includes(typeName)) return "ABSTRACT";
        else if (["info"].includes(typeName)) return "INFO";
        else if (["todo"].includes(typeName)) return "TODO";
        else if (["tip", "hint", "important"].includes(typeName)) return "TIP";
        else if (["success", "check", "done"].includes(typeName)) return "SUCCESS";
        else if (["question", "help", "faq"].includes(typeName)) return "QUESTION";
        else if (["warning", "caution", "attention"].includes(typeName)) return "WARNING";
        else if (["failure", "fail", "missing"].includes(typeName)) return "FAILURE";
        else if (["danger", "error"].includes(typeName)) return "DANGER";
        else if (["bug"].includes(typeName)) return "BUG";
        else if (["example"].includes(typeName)) return "EXAMPLE";
        else if (["quote", "cite"].includes(typeName)) return "QUOTE";
        else return typeName.toUpperCase();
    },

    // from https://help.obsidian.md/Editing+and+formatting/Callouts#Supported%20types
    getIcon: function(type) {
        const icons = {
            NOTE: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path><path d="m15 5 4 4"></path></svg>',
            ABSTRACT: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-clipboard-list"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="M12 11h4"></path><path d="M12 16h4"></path><path d="M8 11h.01"></path><path d="M8 16h.01"></path></svg>',
            INFO: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-info"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>',
            TODO: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-check-circle-2"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>',
            TIP: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-flame"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>',
            SUCCESS: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-check"><path d="M20 6 9 17l-5-5"></path></svg>',
            QUESTION: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-help-circle"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path></svg>',
            WARNING: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>',
            FAILURE: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>',
            DANGER: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
            BUG: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-bug"><path d="m8 2 1.88 1.88"></path><path d="M14.12 3.88 16 2"></path><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"></path><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"></path><path d="M12 20v-9"></path><path d="M6.53 9C4.6 8.8 3 7.1 3 5"></path><path d="M6 13H2"></path><path d="M3 21c0-2.1 1.7-3.9 3.8-4"></path><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"></path><path d="M22 13h-4"></path><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"></path></svg>',
            EXAMPLE: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-list"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>',
            QUOTE: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-quote"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>',
        };
        return icons[type.toUpperCase()] || icons["INFO"];
    },

    // 标题和其他部分主题颜色
    getColor: function(type) {
        const colors = {
            NOTE: '8, 109, 211, 1',
            ABSTRACT: '0, 191, 188, 1',
            INFO: '8, 109, 211, 1',
            TODO: '8, 109, 211, 1',
            TIP: '0, 191, 188, 1',
            SUCCESS: '8, 185, 78, 1',
            QUESTION: '236, 117, 0, 1',
            WARNING: '236, 117, 0, 1',
            FAILURE: '233, 49, 71, 1',
            DANGER: '233, 49, 71, 1',
            BUG: '233, 49, 71, 1',
            EXAMPLE: '120, 82, 238, 1',
            QUOTE: '158, 158, 158, 1',
        };
        return colors[type.toUpperCase()] || colors["INFO"];
    },

    // callout背景颜色
    // from https://help.obsidian.md/Editing+and+formatting/Callouts#Supported%20types
    getBackgoundColor: function(type) {
        const colors = {
            NOTE: '8, 109, 211, 0.1',
            ABSTRACT: '0, 191, 188, 0.1',
            INFO: '8, 109, 211, 0.1',
            TODO: '8, 109, 211, 0.1',
            TIP: '0, 191, 188, 0.1',
            SUCCESS: '8, 185, 78, 0.1',
            QUESTION: '236, 117, 0, 0.1',
            WARNING: '236, 117, 0, 0.1',
            FAILURE: '233, 49, 71, 0.1',
            DANGER: '233, 49, 71, 0.1',
            BUG: '233, 49, 71, 0.1',
            EXAMPLE: '120, 12, 238, 0.1',
            QUOTE: '158, 158, 158, 0.1',
        };
        return colors[type.toUpperCase()] || colors["INFO"];
    },

    // 通用的懒加载触发方法（适用于任何懒加载库）
    triggerLazyLoad: function() {
        window.dispatchEvent(new Event('scroll'));
        window.dispatchEvent(new Event('resize'));
    },

    // 替换操作
    processBlockquote: function(blockquote) {
        var titleNode;
        var firstParagraph = null;

        var tags = [];
        var isCollapsible = 0;
        var backgroundColor = this.getBackgoundColor("INFO");
        var titleColor = this.getColor("INFO");
        var icon = this.getIcon("INFO");
        var title = "";
        var typeName = "INFO";

        // 直接获取原始子节点，不要用 innerHTML 重建
        const children = Array.from(blockquote.childNodes);

        // 找到第一个 <p> 元素节点（跳过文本节点）
        for (let i = 0; i < children.length; i++) {
            const node = children[i];
            if (node.nodeType === 1 && node.tagName.toLowerCase() === 'p') {
                firstParagraph = node;
                titleNode = node.innerHTML;
                break;
            }
        }

        if(!titleNode) {
            blockquote.style.opacity = '';
            blockquote.style.transition = '';
            return;
        }

        // 匹配带有[!xxxx]的标签，判断是否是callout
        if (!titleNode.match(/^\[!(.*?)\]([-+]?)(.*)/g)) {
            blockquote.style.opacity = '';
            blockquote.style.transition = '';
            return;
        }

        tags = matchRecursion(/^\[!([^\[\]]*?)\]/, titleNode);
        titleNode = replaceRecursion(/^\[!([^\[\]]*?)\]/, titleNode);

        if(titleNode.match(/^((-\s)|(-(?!\S)))/)) isCollapsible = 1;
        else if(titleNode.match(/^((\+\s)|(\+(?!\S)))/)) isCollapsible = 2;
        if(isCollapsible) titleNode = titleNode.replace(/^(([+-]\s)|([+-](?!\S)))/, "");
        else titleNode = titleNode.replace(/^[ \r\t]/, "");
        title = titleNode;

        tags.forEach((value) => {
            if(!value.startsWith("TITLE") && !value.startsWith("BACKGROUND") && !value.startsWith("ICON")) {
                typeName = value;
            }
        });

        if(!title) title = typeName;
        titleColor = this.getColor(this.getType(typeName));
        backgroundColor = this.getBackgoundColor(this.getType(typeName));
        icon = this.getIcon(this.getType(typeName));

        tags.forEach((value) => {
            if(value.toUpperCase().startsWith("TITLE ")) {
                var color = value.match(/TITLE ((\d+,){3}[\d.]+)/);
                if(color) titleColor = color[1];
                else titleColor = value.match(/TITLE (\w+)/)[1];
            } else if(value.toUpperCase().startsWith("BACKGROUND ")) {
                var color = value.match(/BACKGROUND ((\d+,){3}[\d.]+)/);
                if(color) backgroundColor = color[1];
                else backgroundColor = value.match(/BACKGROUND (\w+)/)[1];
            } else if(value.toUpperCase().startsWith("ICON ")) {
                icon = value.match(/ICON ([\w+\- ]+)/)[1];
            }
        });

        const callout = document.createElement('div');
        callout.className = `callout callout-${typeName.toLowerCase()}${isCollapsible == 1 ? ' callout-collapsed' : ''}`;
        callout.style.backgroundColor = `rgba(${backgroundColor})`;
        callout.style.borderLeftColor = `rgba(${titleColor})`;

        const header = document.createElement('div');
        header.className = 'callout-header';
        header.style.color = `rgba(${titleColor})`;

        const icon_ = document.createElement('div');
        icon_.className = 'callout-icon';
        var tmp = document.createElement('i');
        if(icon.startsWith("<svg")) {
            icon_.appendChild(parseElement(icon));
        } else {
            tmp.className = icon;
            icon_.appendChild(tmp);
        }

        const titleElement = document.createElement('div');
        titleElement.className = 'callout-title';
        titleElement.innerHTML = title;

        header.appendChild(icon_);
        header.appendChild(titleElement);

        if (isCollapsible) {
            const toggle = document.createElement('div');
            toggle.className = 'callout-toggle fas fa-chevron-down';
            header.appendChild(toggle);

            header.addEventListener('click', () => {
                const isNowCollapsed = callout.classList.contains('callout-collapsed');

                if (isNowCollapsed) {
                    callout.classList.remove('callout-collapsed');
                    setTimeout(() => {
                        this.triggerLazyLoad();
                    }, 100);
                } else {
                    callout.classList.add('callout-collapsed');
                }
            });
        }

        // 直接移动原始 DOM 节点，保留所有事件绑定
        const contentElement = document.createElement('div');
        contentElement.className = 'callout-content';

        // 移动所有子节点，但跳过标题节点
        children.forEach(el => {
            if (el === firstParagraph) {
                return;
            }
            contentElement.appendChild(el);
        });

        callout.appendChild(header);
        callout.appendChild(contentElement);

        if(blockquote.parentNode) {
            blockquote.parentNode.replaceChild(callout, blockquote);
        }

        // 如果不是初始折叠状态，触发懒加载
        if (!isCollapsible || isCollapsible === 2) {
            setTimeout(() => {
                this.triggerLazyLoad();
            }, 100);
        }

        // 递归处理嵌套的blockquotes
        const nestedBlockquotes = callout.querySelectorAll('blockquote');
        if (nestedBlockquotes.length > 0) {
            nestedBlockquotes.forEach(blockquote => {
                this.processBlockquote(blockquote);
            });
        }
    },

    adjustColor: function(color, amount) {
        return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount * 255)).toString(16)).substr(-2));
    },

    createBlockquotes: function() {
        const blockquotes = document.querySelectorAll('blockquote');

        // 先隐藏所有 blockquote，避免闪烁
        blockquotes.forEach(bq => {
            bq.style.opacity = '0';
            bq.style.transition = 'none';
        });

        // 使用 requestAnimationFrame 确保隐藏生效后再处理
        requestAnimationFrame(() => {
            blockquotes.forEach((blockquote) => {
                this.processBlockquote(blockquote);
            });

            // 显示所有 callout
            setTimeout(() => {
                const callouts = document.querySelectorAll('.callout');
                callouts.forEach(callout => {
                    callout.style.opacity = '0';
                    callout.style.transition = 'opacity 0.3s ease';
                    requestAnimationFrame(() => {
                        callout.style.opacity = '1';
                    });
                });
            }, 50);
        });

        // 所有callout处理完成后，触发一次懒加载更新
        setTimeout(() => {
            this.triggerLazyLoad();
        }, 200);
    }
};

const CalloutExpot = {
    init: Callout.init.bind(Callout),
    createBlockquotes: Callout.createBlockquotes.bind(Callout),
}

// 延迟初始化，确保主题的懒加载已完成
function initCallout() {
    setTimeout(() => {
        Callout.init();
    }, 100);
}

if (document.readyState === 'complete') {
    initCallout();
} else {
    window.addEventListener('load', () => {
        initCallout();
    });
}

document.Callout = CalloutExpot;
