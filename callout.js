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
return new DOMParser().parseFromString(htmlString,'text/html').body.childNodes[0]
}

const Callout = 
{
        init: function() {
            // 添加 FontAwesome
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            // https://cdnjs.com/libraries/font-awesome
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
            padding: 16px;
            position: relative;
            transition: all 0.3s ease;
        }

        .callout-header {
            display: flex;
            align-items: center;
            cursor: pointer;
        }

        .callout-icon {
            width: 24px;
            height: 24px;
            margin-right: 8px;
        }

        .callout-title {
            font-weight: bold;
        }

        .callout-content {
            margin-top: 8px;
            overflow: hidden;
            transition: max-height 0.3s ease;
        }

        .callout-collapsed .callout-content {
            max-height: 0;
        }

        .callout-toggle {
            margin-left: auto;
            font-size: 16px;
            line-height: 1;
            transition: transform 0.3s ease;
            user-select: none;
        }

        .callout-collapsed .callout-toggle {
            transform: rotate(-90deg);
        }

        .callout {
            margin-left: 20px;
        }
            `;
            document.head.appendChild(style);

            // this.convertBlockquotes();

            this.createBlockquotes();

            // const blockquotes = document.querySelectorAll('blockquote');
            // blockquotes.forEach(blockquote => {this.processBlockquote(blockquote)});
        },
        // 和obsidian相同
        getType: function(typeName)
        {
            if(typeName in ["note"]) return "NOTE";
            else if(typeName in ["abstract", "summary", "tldr"]) return "ABSTRACT";
            else if(typeName in ["info"]) return "INFO";
            else if(typeName in ["todo"]) return "TODO";
            else if(typeName in ["tip", "hint", "important"]) return "TIP";
            else if(typeName in ["success", "check", "done"]) return "SUCCESS";
            else if(typeName in ["question", "help", "faq"]) return "QUESTION";
            else if(typeName in ["warning", "caution", "attention"]) return "WARNING";
            else if(typeName in ["failure", "fail", "missing"]) return "FAILURE";
            else if(typeName in ["danger", "error"]) return "DANGER";
            else if(typeName in ["bug"]) return "BUG";
            else if(typeName in ["example"]) return "EXAMPLE";
            else if(typeName in ["quote", "cite"]) return "QUOTE";
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
        // from https://help.obsidian.md/Editing+and+formatting/Callouts#Supported%20types
        getColor: function(type) {
            const colors = {
                // R,G,B,A
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
        // 替换操作
        processBlockquote: function(blockquote) {

            var titleNode;
            var contentNode;


            const content = blockquote.innerHTML.trim();
            var tags = [];
            var isCollapsible = 0;
            var backgroundColor = this.getBackgoundColor("INFO");
            var titleColor = this.getColor("INFO");
            var icon = this.getIcon("INFO");
            var title = "";
            var mainContent = content;
            var typeName = "INFO";

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = blockquote.innerHTML.trim();
            const children = Array.from(tempDiv.childNodes);
                // 检查第一个子元素是否为 <p>
                if (children.length > 0 && children[0].tagName && children[0].tagName.toLowerCase() == 'p') {
                    // 将第一个 <p> 的内容作为标题
                    titleNode = children[0].innerHTML;
                    // 移除
                    children.shift();
                }
                // 剩余的所有内容作为正文
                contentNode = children.map(el => {if(el.nodeType==Node.TEXT_NODE) return el.data; else return el.outerHTML;}).join('');
                if(!titleNode) return; // 第一个node不是<p>，不做任何操作


            // 匹配带有[!xxxx]的标签，判断是否是callout
            if (titleNode.match(/^\[!(.*?)\]([-+]?)(.*)/g)) 
            {

                tags = matchRecursion(/^\[!([^\[\]]*?)\]/,titleNode);
                titleNode = replaceRecursion(/^\[!([^\[\]]*?)\]/,titleNode);

                if(titleNode.match(/^((-\s)|(-(?!\S)))/)) isCollapsible = 1;
                else if(titleNode.match(/^((\+\s)|(\+(?!\S)))/)) isCollapsible = 2;
                if(isCollapsible) titleNode =  titleNode.replace(/^(([+-]\s)|([+-](?!\S)))/,"");
                else titleNode =  titleNode.replace(/^[ \r\t]/,"");
                title = titleNode;

                tags.forEach((value)=>{if(!value.startsWith("TITLE") && !value.startsWith("BACKGROUND") &&!value.startsWith("ICON")){typeName = value;}});
                if(!title) title=typeName;
                titleColor = this.getColor(this.getType(typeName));
                backgroundColor = this.getBackgoundColor(this.getType(typeName));
                icon = this.getIcon(this.getType(typeName));

                tags.forEach((value,index,array)=>{
                    // 调整颜色
                    if(value.toUpperCase().startsWith("TITLE "))
                    {
                        var color = value.match(/TITLE ((\d+,){3}[\d.]+)/);
                        if(color) titleColor = color[1];
                        else titleColor = value.match(/TITLE (\w+)/)[1];
                    }
                    else if(value.toUpperCase().startsWith("BACKGROUND "))
                    {
                        var color = value.match(/BACKGROUND ((\d+,){3}[\d.]+)/);
                        if(color) backgroundColor = color[1];
                        else backgroundColor = value.match(/BACKGROUND (\w+)/)[1];
                    }
                    // 调整图标
                    else if(value.toUpperCase().startsWith("ICON "))
                    {
                        icon = value.match(/ICON ([\w+\- ]+)/)[1];
                    }
                });
                // mainContent = mainContent.replace(/([^\[\]]*?)/,"").trim();
                const callout = document.createElement('div');
                callout.className = `callout callout-${typeName.toLowerCase()}${isCollapsible==1 ? ' callout-collapsed' : ''}`;
                // 外观调整
                callout.style.backgroundColor = `rgba(${backgroundColor})`;

                const header = document.createElement('div');
                header.className = 'callout-header';
                header.style.color = `rgba(${titleColor})`;

                const icon_ = document.createElement('div');
                icon_.className = 'callout-icon';
                var tmp = document.createElement('i');
                if(icon.startsWith("<svg")) icon_.appendChild(parseElement(icon));
                else 
                {
                    tmp.className = icon;
                    icon_.appendChild( tmp);
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
                            if(isCollapsible)  callout.classList.toggle('callout-collapsed');
                        });
                }

                const contentElement = document.createElement('div');
                    contentElement.className = 'callout-content';
                    contentElement.innerHTML = contentNode;

                    callout.appendChild(header);
                    callout.appendChild(contentElement);

                    if(blockquote.parentNode) blockquote.parentNode.replaceChild(callout, blockquote);

                    // Recursively convert nested blockquotes
                    const nestedBlockquotes = callout.querySelectorAll('blockquote');
                    if (nestedBlockquotes.length > 0) {
                        nestedBlockquotes.forEach(blockquote => {this.processBlockquote(blockquote)})
                        
                    }
            }
        },
        adjustColor: function(color, amount) {
            return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount * 255)).toString(16)).substr(-2));
        },
        createBlockquotes: function()
        {
            const blockquotes = document.querySelectorAll('blockquote');
            blockquotes.forEach(blockquote => {this.processBlockquote(blockquote)});
        }
};

const CalloutExpot = {
    init: Callout.init,
    createBlockquotes: Callout.createBlockquotes,
}

Callout.init();
setupMutationObserver();
document.Callout = CalloutExpot;
