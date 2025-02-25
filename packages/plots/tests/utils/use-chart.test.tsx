import React from 'react';
import { render, unmount } from '../../src/utils';
import { isFunction } from 'lodash';
import { act } from 'react-dom/test-utils';
import Pie from '../../src/components/pie';
import Area from '../../src/components/area';
import RingProgress from '../../src/components/ring-progress';

describe('use chart', () => {
  let container;
  const data = [
    {
      type: '分类一',
      value: 27,
    },
    {
      type: '分类二',
      value: 25,
    },
  ];
  const areaData = [
    {
      date: '2010-01',
      scales: 1998,
    },
    {
      date: '2010-02',
      scales: 1850,
    },
  ];
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });
  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  it('chart init', () => {
    let chartRef = undefined;
    const props = {
      data,
      angleField: 'value',
      colorField: 'type',
      chartRef: (ref) => {
        chartRef = ref;
      },
    };
    act(() => {
      render(<Pie {...props} />, container);
    });
    // chartRef 存在，图表一定渲染。
    expect(chartRef).not.toBeUndefined();
    const toDataURL = chartRef.toDataURL;
    const regPng = /^data:image\/png;base64/;
    const regJpeg = /^data:image\/jpeg;base64/;
    const imgDataDefaultArg = toDataURL();
    const imgDataWithCustomArg = toDataURL('image/jpeg');
    expect(regPng.test(imgDataDefaultArg)).toBeTruthy();
    expect(regJpeg.test(imgDataWithCustomArg)).toBeTruthy();
    expect(isFunction(chartRef.downloadImage)).toBeTruthy();
    expect(chartRef.downloadImage()).toBe('download.png');
    expect(chartRef.downloadImage('test')).toBe('test.png');
    expect(chartRef.downloadImage('test.jpeg')).toBe('test.jpeg');
    expect(chartRef.downloadImage('test', 'image/jpeg')).toBe('test.jpeg');
  });

  it('chart init with onReady & onEvent', () => {
    let readyChart = undefined;
    let events = undefined;
    const props = {
      data,
      angleField: 'value',
      colorField: 'type',
      onReady: (chart) => {
        readyChart = chart;
      },
      onEvent: (chart, event) => {
        events = event;
      },
    };
    act(() => {
      render(<Pie {...props} />, container);
    });
    expect(readyChart).not.toBeUndefined();
    readyChart.chart.showTooltip({ x: 10, y: 10 });
    readyChart.chart.hideTooltip();
    expect(events.type).toBe('tooltip:hide');
  });

  it.skip('chart destroy', () => {
    let chartRef = undefined;
    const props = {
      data,
      angleField: 'value',
      colorField: 'type',
      chartRef: (ref) => {
        chartRef = ref;
      },
    };
    act(() => {
      render(<Pie {...props} />, container);
    });

    unmount(container);
    expect(chartRef.chart.destroyed).toBeTruthy();
  });

  it('chart change data with normal chart', () => {
    let chartRef;
    const props = {
      data: [],
      xField: 'date',
      yField: 'scales',
      chartRef: (ref) => {
        chartRef = ref;
      },
    };
    act(() => {
      render(<Area {...props} />, container);
    });
    chartRef.update = jest.fn();
    act(() => {
      render(<Area {...props} data={areaData} />, container);
    });
    expect(chartRef.update).not.toHaveBeenCalled();
    expect(chartRef.chart.getData()).toEqual(areaData);
  });

  it('update config with normal chart', () => {
    let chartRef;
    const props = {
      data: areaData,
      xField: 'date',
      yField: 'scales',
      chartRef: (ref) => {
        chartRef = ref;
      },
    };
    act(() => {
      render(<Area {...props} />, container);
    });
    chartRef.changeData = jest.fn();
    act(() => {
      render(<Area {...props} point={{ size: 5 }} />, container);
    });

    expect(chartRef.changeData).not.toHaveBeenCalled();
    expect(chartRef.options.point).toEqual({ size: 5 });
  });

  it('change data with special chart', () => {
    let chartRef;
    const props = {
      percent: 0.2,
      xField: 'date',
      yField: 'scales',
      chartRef: (ref) => {
        chartRef = ref;
      },
    };
    act(() => {
      render(<RingProgress {...props} />, container);
    });
    chartRef.update = jest.fn();
    act(() => {
      render(<RingProgress {...props} percent={0.5} />, container);
    });

    expect(chartRef.chart.getData()).toEqual([
      { percent: 0.5, type: 'current', current: '0.5' },
      { percent: 1, type: 'target', current: '0.5' },
    ]);
  });

  it.skip('processConfig * reactDomToString with virtual DOM', () => {
    let chartRef = undefined;
    const props = {
      data,
      angleField: 'value',
      colorField: 'type',
      chartRef: (ref) => {
        chartRef = ref;
      },
      statistic: {
        content: {
          customHtml: <div>customHtml content</div>,
        },
        title: {
          customHtml: () => <div>customHtml title</div>,
        },
      },
      tooltip: {
        container: () => <div className="toooltip-container"></div>,
        customContent: () => <div>custom tooltip</div>,
      },
    };
    act(() => {
      render(<Pie {...props} />, container);
    });
    // chartRef 存在，图表一定渲染。
    expect(chartRef).not.toBeUndefined();
    expect(chartRef.options.tooltip.customContent().className).toBe('g2-tooltip');
    expect(chartRef.options.tooltip.customContent().innerHTML).toBe('<div>custom tooltip</div>');
    expect(chartRef.options.tooltip.container().innerHTML).toBe('<div class="toooltip-container"></div>');
    expect(chartRef.options.statistic.title.customHtml().className).toBe('');
    expect(chartRef.options.statistic.title.customHtml().innerHTML).toEqual('<div>customHtml title</div>');
    expect(chartRef.options.statistic.content.customHtml().className).toBe('');
    expect(chartRef.options.statistic.content.customHtml().innerHTML).toEqual('<div>customHtml content</div>');
  });

  it('processConfig * reactDomToString with string', () => {
    let chartRef = undefined;
    const props = {
      data,
      angleField: 'value',
      colorField: 'type',
      chartRef: (ref) => {
        chartRef = ref;
      },
      statistic: {
        content: {
          customHtml: 'customHtml content',
        },
        title: {
          customHtml: () => 'customHtml title',
        },
      },
      tooltip: {
        container: '<div class="toooltip-container"></div>',
        customContent: () => 'custom tooltip',
      },
    };
    act(() => {
      render(<Pie {...props} />, container);
    });
    // chartRef 存在，图表一定渲染。
    expect(chartRef).not.toBeUndefined();
    expect(chartRef.options.tooltip.customContent()).toBe('custom tooltip');
    expect(chartRef.options.tooltip.container()).toBe('<div class="toooltip-container"></div>');
    expect(chartRef.options.statistic.content.customHtml()).toBe('customHtml content');
    expect(chartRef.options.statistic.title.customHtml()).toBe('customHtml title');
  });

  it('processConfig * reactDomToString with number', () => {
    let chartRef = undefined;
    const props = {
      data,
      angleField: 'value',
      colorField: 'type',
      chartRef: (ref) => {
        chartRef = ref;
      },
      statistic: {
        title: {
          customHtml: () => 1,
        },
        content: {
          customHtml: 2,
        },
      },
      tooltip: {
        customContent: () => 3,
      },
    };
    act(() => {
      render(<Pie {...props} />, container);
    });
    // chartRef 存在，图表一定渲染。
    expect(chartRef).not.toBeUndefined();
    expect(chartRef.options.tooltip.customContent()).toBe(3);
    expect(chartRef.options.statistic.content.customHtml()).toBe(2);
    expect(chartRef.options.statistic.title.customHtml()).toBe(1);
  });

  it('processConfig * reactDomToString with HTMLElement', () => {
    let chartRef = undefined;
    const props = {
      data,
      angleField: 'value',
      colorField: 'type',
      chartRef: (ref) => {
        chartRef = ref;
      },
      statistic: {
        title: {
          customHtml: () => {
            const div = document.createElement('div');
            div.innerHTML = 'title';
            return div;
          },
        },
        content: {
          customHtml: () => {
            const div = document.createElement('div');
            div.innerHTML = 'content';
            return div;
          },
        },
      },
      tooltip: {
        container: () => {
          const div = document.createElement('div');
          div.innerHTML = 'container';
          return div;
        },
        customContent: () => {
          const div = document.createElement('div');
          div.innerHTML = 'tooltip';
          return div;
        },
      },
    };
    act(() => {
      render(<Pie {...props} />, container);
    });
    // chartRef 存在，图表一定渲染。
    expect(chartRef).not.toBeUndefined();
    expect(chartRef.options.tooltip.customContent().innerHTML).toBe('tooltip');
    expect(chartRef.options.tooltip.container().innerHTML).toBe('container');
    expect(chartRef.options.statistic.content.customHtml().innerHTML).toBe('content');
    expect(chartRef.options.statistic.title.customHtml().innerHTML).toBe('title');
  });

  it('deep clone', () => {
    const title = {
      text: 'net work',
    };
    let chartRef;
    const props = {
      percent: 0.2,
      xField: 'date',
      yField: 'scales',
      xAxis: { title },
      chartRef: (ref) => {
        chartRef = ref;
      },
    };
    act(() => {
      render(<RingProgress {...props} />, container);
    });
    title.text = 'work';
    act(() => {
      render(<RingProgress {...props} xAxis={{ title }} />, container);
    });

    expect(chartRef.options.xAxis.title).toEqual({ text: 'work' });
  });
});
