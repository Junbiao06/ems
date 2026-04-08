const Loading = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      {/* 半透明遮罩 */}
      <div className="absolute inset-0"></div>

      {/* 中心旋转图标 */}
      <div className="relative flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-surface-secondary border-t-primary rounded-full animate-spin" />

        <p className="mt-4 text-surface-secondary font-medium font-playwrite text-3xl">
          Your data is coming soon...
        </p>
      </div>
    </div>
  );
};

export default Loading;
