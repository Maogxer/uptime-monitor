// composables/useRefreshTimer.ts
import { ref, computed, onMounted, onUnmounted } from 'vue';

/**
 * 一个可复用的倒计时刷新逻辑 Composable.
 * @param refreshFn 当倒计时结束时要执行的函数.
 * @param intervalSeconds 倒计时的秒数，默认为 300.
 */
export function useRefreshTimer(refreshFn: () => void, intervalSeconds = 300) {
  const countdown = ref(intervalSeconds);
  let timer: NodeJS.Timeout;

  // 计算分钟和秒数，用于显示
  const countdownMinutes = computed(() => Math.floor(countdown.value / 60).toString().padStart(2, '0'));
  const countdownSeconds = computed(() => (countdown.value % 60).toString().padStart(2, '0'));

  // 开始倒计时
  const start = () => {
    // 先清除已有的计时器，防止重复
    clearInterval(timer);
    countdown.value = intervalSeconds;
    timer = setInterval(() => {
      if (countdown.value > 0) {
        countdown.value--;
      } else {
        // 倒计时结束，执行刷新函数
        refreshFn();
      }
    }, 1000);
  };

  // 停止计时器
  const stop = () => {
    clearInterval(timer);
  };

  // 重置计时器 (例如，在手动刷新后)
  const reset = () => {
    stop();
    start();
  };

  // 组件挂载时开始计时
  onMounted(start);
  // 组件卸载时清除计时器，防止内存泄漏
  onUnmounted(stop);

  return {
    countdownMinutes,
    countdownSeconds,
    resetTimer: reset,
  };
}