const chokidar = require('chokidar');
const { SvgComponentGenerator } = require('auto-svg-component-generator');

let watcher = null; // 전역 또는 모듈 수준의 변수로 watcher를 관리

const svgCompGenertor = new SvgComponentGenerator({
  svgFileDir: 'src/assets/svgs',
  outputDir: 'src/components/icons',
  typescript: true,
  svgo: {
    plugins: [
      {
        name: "preset-default",
        params: {
          overrides: {
            removeViewBox: false // ✅ viewBox 유지
          }
        }
      },
      {
        name: "removeDimensions" // ✅ width, height 제거
      },
      {
        name: "addAttributesToSVGElement", // ✅ width, height 기본값 추가
        params: {
          attributes: [
            { width: "1em" },
            { height: "1em" }
          ]
        }
      },
      {
        name: "convertStyleToAttrs" // ✅ CSS 스타일을 속성으로 변환
      },
      {
        name: "convertColors",
        params: { currentColor: true } // ✅ fill을 currentColor로 변경
      }
    ]
  }
})

if (process.env.NODE_ENV === 'development') {
  if (!watcher) { // Watcher가 이미 존재하지 않는 경우에만 생성
    watcher = chokidar.watch('src/assets/svgs', { persistent: true, ignored: /\/svg\/types\// });
  }

  watcher.on('add', svgCompGenertor.generate);
  watcher.on('unlink', svgCompGenertor.generate);
} else {
  void svgCompGenertor.generate();
}


process.once('SIGINT', () => {
	if (watcher) {
		watcher.close();
	}

	process.exit(0);
});