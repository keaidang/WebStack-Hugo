/**
 * 视频背景控制脚本
 * 根据当前时间自动切换白天/晚上视频
 */

$(document).ready(function() {
    const video = document.getElementById('bg-video');
    const dayVideo = document.getElementById('day-video');
    const nightVideo = document.getElementById('night-video');
    
    if (!video || !dayVideo || !nightVideo) {
        console.log('视频元素未找到，跳过视频背景初始化');
        return;
    }

    // 存储视频源路径
    const dayVideoSrc = dayVideo.src;
    const nightVideoSrc = nightVideo.src;

    // 获取当前时间
    function getCurrentTime() {
        return new Date().getHours();
    }

    // 判断是否为白天（6:00 - 18:00）
    function isDayTime() {
        const hour = getCurrentTime();
        return hour >= 6 && hour < 18;
    }

    // 切换视频
    function switchVideo(isDay) {
        if (isDay) {
            // 切换到白天视频
            dayVideo.style.display = 'block';
            nightVideo.style.display = 'none';
            console.log('切换到白天视频');
        } else {
            // 切换到晚上视频
            dayVideo.style.display = 'none';
            nightVideo.style.display = 'block';
            console.log('切换到晚上视频');
        }
        
        // 重新加载并播放视频
        video.load();
        video.play().catch(function(error) {
            console.log('视频播放失败:', error);
            // 如果视频播放失败，显示默认背景
            document.getElementById('search-bg').style.backgroundImage = 'url(assets/images/bg-dna.jpg)';
        });
    }

    // 初始化视频
    function initVideo() {
        const isDay = isDayTime();
        switchVideo(isDay);
        console.log('视频背景已初始化，当前模式:', isDay ? '白天' : '晚上');
    }

    // 监听视频加载错误
    video.addEventListener('error', function(e) {
        console.log('视频加载失败:', e);
        // 如果视频加载失败，可以显示默认背景
        document.getElementById('search-bg').style.backgroundImage = 'url(assets/images/bg-dna.jpg)';
    });

    // 监听视频加载完成
    video.addEventListener('loadeddata', function() {
        console.log('视频加载完成');
    });

    // 定期检查时间变化（每分钟检查一次）
    setInterval(function() {
        const isDay = isDayTime();
        const currentVideo = dayVideo.style.display !== 'none' ? 'day' : 'night';
        const shouldBeDay = isDay;
        
        if ((shouldBeDay && currentVideo !== 'day') || (!shouldBeDay && currentVideo !== 'night')) {
            switchVideo(shouldBeDay);
            console.log('时间变化，切换视频到:', shouldBeDay ? '白天' : '晚上');
        }
    }, 60000); // 每分钟检查一次

    // 初始化
    initVideo();

    // 添加手动切换功能（可选）
    window.switchVideoMode = function() {
        const isDay = isDayTime();
        switchVideo(!isDay);
        console.log('手动切换视频到:', !isDay ? '白天' : '晚上');
    };
});
