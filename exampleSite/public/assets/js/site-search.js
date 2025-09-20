/**
 * 站内搜索功能 - 增强版
 * 支持中英文模糊搜索和下拉栏显示
 */

$(document).ready(function() {
    let searchData = [];
    let isSiteSearchMode = false;
    let currentSearchResults = [];
    let selectedIndex = -1;
    
    // 加载搜索数据
    function loadSearchData() {
        searchData = [];
        $('.webstack-item').each(function() {
            const $item = $(this);
            const title = $item.find('.webstack-title').text().trim();
            const description = $item.find('.webstack-description').text().trim();
            const url = $item.find('a[href]').first().attr('href');
            const category = $item.attr('data-category') || '';
            
            if (title) {
                searchData.push({
                    title: title,
                    description: description,
                    url: url,
                    category: category,
                    element: $item
                });
            }
        });
        console.log(`加载了 ${searchData.length} 个搜索项`);
    }
    
    // 中英文模糊搜索算法
    function fuzzySearch(query, text) {
        if (!query || !text) return 0;
        
        const queryLower = query.toLowerCase();
        const textLower = text.toLowerCase();
        
        // 完全匹配
        if (textLower === queryLower) return 100;
        
        // 包含匹配
        if (textLower.includes(queryLower)) return 80;
        
        // 拼音匹配（简单实现）
        const pinyinScore = getPinyinScore(queryLower, textLower);
        if (pinyinScore > 0) return pinyinScore;
        
        // 字符相似度匹配
        const similarity = getSimilarity(queryLower, textLower);
        return similarity > 0.3 ? similarity * 60 : 0;
    }
    
    // 简单的拼音匹配
    function getPinyinScore(query, text) {
        const pinyinMap = {
            'a': '啊阿', 'b': '不把', 'c': '从才', 'd': '的到', 'e': '而二',
            'f': '发分', 'g': '个过', 'h': '和好', 'i': '一以', 'j': '就进',
            'k': '可看', 'l': '了来', 'm': '们没', 'n': '你年', 'o': '哦欧',
            'p': '平朋', 'q': '去前', 'r': '人如', 's': '是上', 't': '他天',
            'u': '无我', 'v': '为文', 'w': '我无', 'x': '下小', 'y': '一有',
            'z': '在子'
        };
        
        let score = 0;
        for (let i = 0; i < query.length; i++) {
            const char = query[i];
            if (pinyinMap[char] && text.includes(pinyinMap[char])) {
                score += 20;
            }
        }
        return score;
    }
    
    // 计算字符串相似度
    function getSimilarity(str1, str2) {
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;
        
        if (longer.length === 0) return 1.0;
        
        const distance = levenshteinDistance(longer, shorter);
        return (longer.length - distance) / longer.length;
    }
    
    // 计算编辑距离
    function levenshteinDistance(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }
    
    // 创建搜索下拉栏
    function createSearchDropdown() {
        if ($('#site-search-dropdown').length === 0) {
            const dropdown = $(`
                <div id="site-search-dropdown" class="site-search-dropdown" style="display: none;">
                    <div class="search-dropdown-header">
                        <span class="search-results-count">搜索结果</span>
                        <button class="close-dropdown" type="button">
                            <i class="iconfont icon-close"></i>
                        </button>
                    </div>
                    <div class="search-dropdown-list"></div>
                </div>
            `);
            $('.super-search-fm').append(dropdown);
        }
    }
    
    // 显示搜索下拉栏
    function showSearchDropdown(results, query) {
        createSearchDropdown();
        const $dropdown = $('#site-search-dropdown');
        const $list = $dropdown.find('.search-dropdown-list');
        const $count = $dropdown.find('.search-results-count');
        
        currentSearchResults = results;
        selectedIndex = -1;
        
        if (results.length === 0) {
            $count.text('未找到相关结果');
            $list.html(`
                <div class="search-no-results">
                    <i class="iconfont icon-search"></i>
                    <p>未找到包含 "${query}" 的结果</p>
                    <small>尝试使用其他关键词</small>
                </div>
            `);
        } else {
            $count.text(`找到 ${results.length} 个结果`);
            const resultsHTML = results.map((item, index) => `
                <div class="search-dropdown-item" data-index="${index}" data-url="${item.url}">
                    <div class="search-item-content">
                        <div class="search-item-title">${highlightText(item.title, query)}</div>
                        <div class="search-item-description">${highlightText(item.description, query)}</div>
                        <div class="search-item-meta">
                            <span class="search-item-category">${item.category}</span>
                            <span class="search-item-url">${formatUrl(item.url)}</span>
                        </div>
                    </div>
                </div>
            `).join('');
            
            $list.html(resultsHTML);
        }
        
        $dropdown.show();
    }
    
    // 隐藏搜索下拉栏
    function hideSearchDropdown() {
        $('#site-search-dropdown').hide();
        currentSearchResults = [];
        selectedIndex = -1;
    }
    
    // 高亮文本
    function highlightText(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    // 格式化URL
    function formatUrl(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname;
        } catch {
            return url;
        }
    }
    
    // 选择搜索结果并跳转
    function selectSearchResult(index) {
        if (index >= 0 && index < currentSearchResults.length) {
            const result = currentSearchResults[index];
            
            // 隐藏下拉栏
            hideSearchDropdown();
            
            // 显示跳转提示
            showJumpMessage(result.title);
            
            // 跳转到网站
            if (result.url) {
                window.open(result.url, '_blank');
            }
        }
    }
    
    // 显示跳转消息
    function showJumpMessage(title) {
        const message = $(`
            <div class="search-jump-message">
                <i class="iconfont icon-external-link"></i>
                正在跳转到: ${title}
            </div>
        `);
        
        $('body').append(message);
        
        setTimeout(() => {
            message.fadeOut(() => message.remove());
        }, 2000);
    }
    
    // 站内搜索
    function performSiteSearch(query) {
        if (!query.trim()) {
            hideSearchDropdown();
            return;
        }
        
        const results = [];
        
        // 使用模糊搜索算法
        searchData.forEach(item => {
            const titleScore = fuzzySearch(query, item.title);
            const descScore = fuzzySearch(query, item.description);
            const categoryScore = fuzzySearch(query, item.category);
            
            const maxScore = Math.max(titleScore, descScore, categoryScore);
            
            if (maxScore > 20) { // 设置最低匹配阈值
                results.push({
                    ...item,
                    score: maxScore,
                    matchType: titleScore === maxScore ? 'title' : 
                              descScore === maxScore ? 'description' : 'category'
                });
            }
        });
        
        // 按分数排序
        results.sort((a, b) => b.score - a.score);
        
        // 限制显示数量
        const limitedResults = results.slice(0, 10);
        
        // 显示下拉栏
        showSearchDropdown(limitedResults, query);
        
        return limitedResults;
    }
    
    // 清除搜索高亮
    function clearSearchHighlight() {
        $('.search-highlight').removeClass('search-highlight');
        hideSearchDropdown();
    }
    
    // 监听搜索类型变化
    $('input[name="type"]').on('change', function() {
        const value = $(this).val();
        const placeholder = $(this).data('placeholder');
        const $searchInput = $('#search-text');
        
        if (value === 'site-search') {
            isSiteSearchMode = true;
            $searchInput.attr('placeholder', placeholder);
        } else {
            isSiteSearchMode = false;
            $searchInput.attr('placeholder', placeholder);
            clearSearchHighlight();
        }
    });
    
    // 监听搜索表单提交
    $('.super-search-fm').on('submit', function(e) {
        const $selectedType = $('input[name="type"]:checked');
        const searchValue = $('#search-text').val().trim();
        
        if ($selectedType.val() === 'site-search') {
            e.preventDefault();
            if (searchValue) {
                performSiteSearch(searchValue);
            }
            return false;
        }
        // 其他搜索类型保持原有行为
    });
    
    // 监听搜索按钮点击
    $('.submit').on('click', function(e) {
        const $selectedType = $('input[name="type"]:checked');
        const searchValue = $('#search-text').val().trim();
        
        if ($selectedType.val() === 'site-search') {
            e.preventDefault();
            if (searchValue) {
                performSiteSearch(searchValue);
            }
            return false;
        }
        // 其他搜索类型保持原有行为
    });
    
    // 监听输入框键盘事件
    $('#search-text').on('keydown', function(e) {
        const $selectedType = $('input[name="type"]:checked');
        
        if ($selectedType.val() === 'site-search') {
            const searchValue = $(this).val().trim();
            
            switch(e.which) {
                case 13: // Enter键
                    e.preventDefault();
                    if (currentSearchResults.length > 0 && selectedIndex >= 0) {
                        // 如果有选中的结果，直接跳转
                        selectSearchResult(selectedIndex);
                    } else if (searchValue) {
                        // 如果没有选中结果，执行搜索
                        performSiteSearch(searchValue);
                    }
                    return false;
                    
                case 27: // Escape键
                    hideSearchDropdown();
                    break;
                    
                case 38: // 上箭头
                    e.preventDefault();
                    if (currentSearchResults.length > 0) {
                        selectedIndex = Math.max(0, selectedIndex - 1);
                        updateSelectedItem();
                    }
                    break;
                    
                case 40: // 下箭头
                    e.preventDefault();
                    if (currentSearchResults.length > 0) {
                        selectedIndex = Math.min(currentSearchResults.length - 1, selectedIndex + 1);
                        updateSelectedItem();
                    }
                    break;
            }
        }
    });
    
    // 更新选中项样式
    function updateSelectedItem() {
        $('.search-dropdown-item').removeClass('selected');
        if (selectedIndex >= 0 && selectedIndex < currentSearchResults.length) {
            $(`.search-dropdown-item[data-index="${selectedIndex}"]`).addClass('selected');
        }
    }
    
    // 监听输入框输入
    $('#search-text').on('input', function() {
        const $selectedType = $('input[name="type"]:checked');
        const searchValue = $(this).val().trim();
        
        if ($selectedType.val() === 'site-search') {
            if (searchValue.length >= 2) {
                performSiteSearch(searchValue);
            } else if (searchValue === '') {
                clearSearchHighlight();
            }
        }
    });
    
    // 监听搜索结果项点击
    $(document).on('click', '.search-dropdown-item', function() {
        const index = parseInt($(this).data('index'));
        selectSearchResult(index);
    });
    
    // 监听关闭按钮点击
    $(document).on('click', '.close-dropdown', function() {
        hideSearchDropdown();
    });
    
    // 监听点击外部关闭下拉栏
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.super-search-fm').length) {
            hideSearchDropdown();
        }
    });
    
    // 页面加载完成后初始化
    loadSearchData();
    
    // 页面内容变化时重新加载数据
    $(document).on('DOMNodeInserted', function() {
        setTimeout(loadSearchData, 100);
    });
});

// 添加搜索样式
const searchCSS = `
<style>
/* 搜索下拉栏样式 */
.site-search-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    max-height: 400px;
    overflow: hidden;
    margin-top: 5px;
    animation: slideDown 0.3s ease-out;
}

.search-dropdown-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
    border-radius: 8px 8px 0 0;
}

.search-results-count {
    font-size: 14px;
    color: #6c757d;
    font-weight: 500;
}

.close-dropdown {
    background: none;
    border: none;
    color: #6c757d;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.2s ease;
}

.close-dropdown:hover {
    background: #e9ecef;
    color: #495057;
}

.search-dropdown-list {
    max-height: 320px;
    overflow-y: auto;
}

.search-dropdown-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #f1f3f4;
    cursor: pointer;
    transition: all 0.2s ease;
}

.search-dropdown-item:hover,
.search-dropdown-item.selected {
    background: #f8f9fa;
}

.search-dropdown-item:last-child {
    border-bottom: none;
}

.search-item-content {
    flex: 1;
    min-width: 0;
}

.search-item-title {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0 0 4px 0;
    line-height: 1.3;
}

.search-item-description {
    font-size: 14px;
    color: #666;
    margin: 0 0 8px 0;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.search-item-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 12px;
}

.search-item-category {
    background: #e3f2fd;
    color: #1976d2;
    padding: 2px 8px;
    border-radius: 12px;
    font-weight: 500;
}

.search-item-url {
    color: #28a745;
    font-family: monospace;
}

/* 移除确认按钮相关样式 */

.search-no-results {
    text-align: center;
    padding: 40px 20px;
    color: #6c757d;
}

.search-no-results i {
    font-size: 48px;
    color: #dee2e6;
    margin-bottom: 16px;
    display: block;
}

.search-no-results p {
    font-size: 16px;
    margin: 0 0 8px 0;
    font-weight: 500;
}

.search-no-results small {
    font-size: 14px;
    color: #adb5bd;
}

/* 搜索高亮样式 */
.search-highlight {
    background: rgba(255, 193, 7, 0.3) !important;
    border-radius: 4px;
    transition: all 0.3s ease;
    animation: highlightPulse 0.5s ease-in-out;
}

@keyframes highlightPulse {
    0% { background: rgba(255, 193, 7, 0.1); }
    50% { background: rgba(255, 193, 7, 0.4); }
    100% { background: rgba(255, 193, 7, 0.3); }
}

/* 跳转消息样式 */
.search-jump-message {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #007bff;
    color: white;
    padding: 12px 20px;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 9999;
    font-size: 14px;
    animation: slideInRight 0.3s ease-out;
}

.search-jump-message i {
    margin-right: 8px;
}

/* 高亮文本样式 */
mark {
    background: #fff3cd;
    color: #856404;
    padding: 1px 2px;
    border-radius: 2px;
    font-weight: 600;
}

/* 动画效果 */
@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(100%);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

/* 响应式设计 */
@media (max-width: 768px) {
    .site-search-dropdown {
        left: 10px;
        right: 10px;
        max-height: 300px;
    }
    
    .search-dropdown-item {
        flex-direction: column;
        align-items: flex-start;
        padding: 16px;
    }
    
    .search-item-meta {
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
    }
    
    .search-jump-message {
        top: 10px;
        right: 10px;
        left: 10px;
    }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
    .site-search-dropdown {
        background: #2d3748;
        border-color: #4a5568;
        color: #e2e8f0;
    }
    
    .search-dropdown-header {
        background: #1a202c;
        border-color: #4a5568;
    }
    
    .search-results-count {
        color: #a0aec0;
    }
    
    .close-dropdown {
        color: #a0aec0;
    }
    
    .close-dropdown:hover {
        background: #4a5568;
        color: #e2e8f0;
    }
    
    .search-dropdown-item {
        border-color: #4a5568;
    }
    
    .search-dropdown-item:hover,
    .search-dropdown-item.selected {
        background: #1a202c;
    }
    
    .search-item-title {
        color: #e2e8f0;
    }
    
    .search-item-description {
        color: #a0aec0;
    }
    
    .search-item-category {
        background: #2b6cb0;
        color: #bee3f8;
    }
    
    .search-item-url {
        color: #68d391;
    }
    
    .search-no-results {
        color: #a0aec0;
    }
    
    .search-no-results i {
        color: #4a5568;
    }
    
    .search-no-results small {
        color: #718096;
    }
    
    mark {
        background: #744210;
        color: #f6e05e;
    }
    
    .search-highlight {
        background: rgba(255, 193, 7, 0.3) !important;
    }
}

/* 滚动条样式 */
.search-dropdown-list::-webkit-scrollbar {
    width: 6px;
}

.search-dropdown-list::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

.search-dropdown-list::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
}

.search-dropdown-list::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

@media (prefers-color-scheme: dark) {
    .search-dropdown-list::-webkit-scrollbar-track {
        background: #4a5568;
    }
    
    .search-dropdown-list::-webkit-scrollbar-thumb {
        background: #718096;
    }
    
    .search-dropdown-list::-webkit-scrollbar-thumb:hover {
        background: #a0aec0;
    }
}
</style>
`;

// 将样式添加到页面
$('head').append(searchCSS);