import React, { forwardRef, useState, useRef, useEffect } from "react";

const ChatPanel = forwardRef(({ chatHistory, onOptionClick, toc }, ref) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [hasOverflow, setHasOverflow] = useState(false);
  const keywordButtonsRef = useRef(null);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (e.key === 'Enter' && value.trim()) {
      // Add search query as user message
      const userMessage = {
        type: 'user',
        content: `검색: ${value}`,
        options: []
      };

      // Add search results as bot message
      const botMessage = {
        type: 'bot',
        content: '검색 결과:',
        options: filteredKeywords
      };

      // Update chat history
      onOptionClick({ type: 'addMessages', messages: [userMessage, botMessage] });

      // Clear search input
      setSearchQuery("");
    }
  };

  const filteredKeywords = toc
    .filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .map((item) => ({
      text: item.title,
      page: item.page,
      level: item.level,
    }));

  useEffect(() => {
    if (keywordButtonsRef.current) {
      const hasScrollbar = keywordButtonsRef.current.scrollHeight > keywordButtonsRef.current.clientHeight;
      setHasOverflow(hasScrollbar);
    }
  }, [filteredKeywords]);

  const chatContainer = [];
  chatHistory.map((message, index) => {
    chatContainer.push(
      <div key={index} className={`chat-message ${message.type}`}>
        <div className="message-content">
          {message.type === "user" ? '" ' + message.content + ' "' : message.content}
        </div>
        {message.options && message.options.length > 0 && (
          <div className="message-options">
            {message.options.map((option, optIndex) => (
              <button key={optIndex} className="option-button" onClick={() => onOptionClick(option)}>
                {option.text}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  });

  return (
    <div className="chat-container">
      <div className="chat-messages" ref={ref}>
        {chatContainer}
      </div>
      <div className="chat-search-bottom">
        <div className="search-header">
          <div className="search-input-container">
            <input
              type="text"
              placeholder="목차를 검색해보세요!"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="search-input"
            />
          </div>
          <button className="search-refresh-button" onClick={() => onOptionClick({ text: "reset", page: 1, level: 1 })}>
            <span className="material-symbols-outlined">refresh</span>
          </button>
        </div>
        {searchQuery && (
          <div className={`keyword-buttons ${hasOverflow ? 'overflow' : ''}`} ref={keywordButtonsRef}>
            {filteredKeywords.map((keyword, index) => (
              <button
                key={index}
                className="option-button"
                onClick={() => {
                  onOptionClick(keyword);
                  setSearchQuery("");
                }}
              >
                {keyword.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default ChatPanel;
