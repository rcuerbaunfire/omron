baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const ROI_FETCH_RECORD_URL = '/wp-json/omronroi/v1/fetch-record';

        const is404 = () => {
            if ($("section.not-found").length) {
                $("nav").removeClass("regular").addClass("dark");
            } else {
                script();
            }
        }

        const script = () => {
            const els = $("section.content-financial-result");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);

                baunfire.Animation.headingAnimation(self.find(".main-title .inner-word"), {
                    trigger: self,
                    start: "top 60%",
                }, {
                    onStart: () => {
                        baunfire.Animation.descAnimation(self.find(".para-desc"));
                    }
                });

                fetchRecord(self);
                handleLottie(self, self.find(".lottie"));
            });
        }

        const formatData = (data) => {
            return data.map(num => Math.round(num).toString());
        }

        const fetchRecord = (self) => {
            const el = self.find(".graph-container");
            if (!el.length) return;

            const inner = self.find(".graph-inner");

            const recordData = new URLSearchParams(window.location.search);
            const recordID = recordData.get('id');
            if (!recordID) return;

            const query = new URLSearchParams({ id: recordID }).toString();

            fetch(`${ROI_FETCH_RECORD_URL}?${query}`)
                .then((res) => res.json())
                .then(res => {
                    if (!res || !res.success || !res.data) return;
                    inner.removeClass("loading");

                    const { stats, currency, annual_cf, cumulative_cf, annual_savings, leasing, cumulative_leasing } = res.data;

                    setTimeout(() => {
                        handleCounters(self, stats);
                        handleCapexChart(self, currency, formatData(annual_cf), formatData(cumulative_cf));
                        handleLeasingChart(self, currency, formatData(annual_savings), leasing, cumulative_leasing);
                    }, 300);
                })
                .catch(error => {
                    console.error("Error sending form data:", error);
                });

            handleShareResult(self);
        };

        const getDefaultChartConfig = (container, currency) => {
            return {
                chart: {
                    height: container.get(0).clientHeight,
                    type: "line",
                    fontSize: '16px',
                    fontFamily: '"kh-teka", "sans-serif"',
                    fontWeight: '600',
                    fontColor: '#B6B5B1',
                    borderColorHover: 'red',
                    toolbar: {
                        show: false
                    },
                    zoom: {
                        enabled: false,
                    }
                },
                xaxis: {
                    tickPlacement: "between",
                    labels: {
                        style: {
                            fontSize: '16px',
                            colors: '#B6B5B1',
                        }
                    },
                    categories: [
                        "Year 1",
                        "Year 2",
                        "Year 3",
                        "Year 4",
                        "Year 5",
                    ],
                    tooltip: {
                        enabled: false
                    },
                },
                yaxis: {
                    type: 'numeric',
                    tickAmount: 5,
                    forceNiceScale: false,
                    labels: {
                        style: {
                            fontSize: '16px',
                            colors: ['#B6B5B1'],
                        },
                        formatter: function (value) {
                            const absValue = Math.abs(value);
                            const sign = value < 0 ? '-' : '';

                            let text = `${currency} ${sign}${Math.round(absValue)}`;

                            if (absValue >= 1_000_000) {
                                text = `${currency} ${sign}${Math.round(absValue / 1_000_000)} M`;
                            } else if (absValue >= 1_000) {
                                text = `${currency} ${sign}${Math.round(absValue / 1_000)} K`;
                            }

                            return text;
                        }
                    },
                },
                legend: {
                    formatter: function (seriesName, opts) {
                        const color = opts.w.globals.colors[opts.seriesIndex];
                        return `<span class="chart-marker" style="background: ${color};"></span>${seriesName}`;
                    },
                    offsetY: 12,
                    fontSize: '16px',
                    fontFamily: '"kh-teka", "sans-serif"',
                    markers: {
                        size: 0
                    },
                    itemMargin: {
                        horizontal: 24,
                    },
                    onItemClick: {
                        toggleDataSeries: false
                    },
                },
                tooltip: {
                    // followCursor: true,
                    style: {
                        fontSize: '16px',
                        fontFamily: '"kh-teka", "sans-serif"',
                    },
                    marker: {
                        show: false,
                    },
                    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                        return handleChartTooltip(currency, series, seriesIndex, dataPointIndex, w);
                    }
                },
                dataLabels: {
                    enabled: false
                },
                plotOptions: {
                    bar: {
                        borderRadius: 0,
                        columnWidth: '50%'
                    }
                },
                markers: {
                    size: 0,
                    hover: {
                        size: 0
                    }
                },
                grid: {
                    yaxis: {
                        lines: {
                            show: true
                        }
                    },
                    strokeDashArray: 4
                },
            };
        }

        const handleCapexChart = (self, currency, acf, ccf) => {
            const chartContainer = self.find(".chart.one .chart-inner");
            const chartConfig = getDefaultChartConfig(chartContainer, currency);

            const options = {
                ...chartConfig,
                series: [
                    {
                        name: "Cumulative Cash Flow",
                        data: ccf,
                        type: 'line',
                    },
                    {
                        name: "Annual Cash Flow",
                        data: acf,
                        type: 'column',
                    },
                ],
                fill: {
                    type: ['solid', 'gradient'],
                    gradient: {
                        type: "vertical",
                        shadeIntensity: 1,
                        gradientToColors: ["#6AFF96"],
                        inverseColors: false,
                        opacityFrom: 1,
                        opacityTo: 0,
                        stops: [0, 100]
                    }
                },
                stroke: {
                    show: true,
                    width: [1, 0],
                    colors: ['#1263FF', 'transparent']
                },
                colors: ['#1263FF', '#6AFF96'],
            };

            const chart = new ApexCharts(chartContainer.get(0), options);

            chart.render().then(() => {
                handleChartAnnotations(chart);
            });
        };

        const handleLeasingChart = (self, currency, as, ls, cls) => {
            const chartContainer = self.find(".chart.two .chart-inner");
            const chartConfig = getDefaultChartConfig(chartContainer, currency);

            const options = {
                ...chartConfig,
                series: [
                    {
                        name: "Cumulative Leasing",
                        data: formatData(cls['60']),
                        type: 'line',
                    },
                    {
                        name: "Annual Savings",
                        data: as,
                        type: 'column',
                    },
                    {
                        name: "Leasing",
                        data: formatData(ls['60']),
                        type: 'column',
                    },
                ],
                fill: {
                    colors: ['#1263FF', '#1EE699', '#6AFF96'],
                    type: ['solid', 'gradient', 'gradient'],
                    gradient: {
                        type: "vertical",
                        shadeIntensity: 1,
                        gradientToColors: ["#6AFF96"],
                        inverseColors: false,
                        opacityFrom: 1,
                        opacityTo: 0,
                        stops: [0, 100]
                    }
                },
                stroke: {
                    show: true,
                    width: [1, 0, 0],
                    colors: ['#1263FF', 'transparent', 'transparent']
                },
                colors: ['#1263FF', '#1EE699', '#6AFF96'],
            };

            const chart = new ApexCharts(chartContainer.get(0), options);

            chart.render().then(() => {
                handleChartAnnotations(chart);
            });

            handleTermSelect(self, chart, as, ls, cls);
        };

        const handleChartAnnotations = (chart) => {
            chart.clearAnnotations();

            for (let i = 0; i <= chart.w.globals.series[0].length; i++) {
                const datapoint = chart.w.config.series[0].data[i - 1];

                if (datapoint === undefined) continue;

                chart.addPointAnnotation({
                    x: `Year ${i}`,
                    y: datapoint,
                    marker: {
                        size: 0
                    },
                    image: {
                        path: `${templateURL}/assets/img/svg/graph-dot.svg`,
                        offsetY: 0,
                        width: 12,
                        height: 12,
                    }
                });
            }
        }

        const handleChartTooltip = (currency, series, seriesIndex, dataPointIndex, w) => {
            const label = w.globals.labels[dataPointIndex] || '';
            let html = `<div class="chart-tooltip">`;
            html += `<small>${label}</small>`;

            series.forEach((s, i) => {
                const name = w.globals.seriesNames[i];
                const value = s[dataPointIndex];
                html += `<div class="chart-tooltip-item"><div class="chart-tooltip-eyebrow"><div class="chart-tooltip-icon" style="background: ${w.config.colors[i]};"></div><p class="sm">${name}</p></div><p class="lg">${currency} ${value.toLocaleString()}</p></div>`;
            });

            html += `</div>`;
            return html;
        }

        const handleTermSelect = (self, chart, as, ls, cls) => {
            const select = self.find(".jselect.terms select");
            if (!select.length) return;

            select.selectmenu({
                classes: {
                    "ui-selectmenu-menu": "terms"
                },
                open: function (event, ui) {
                    const target = $(this);
                    baunfire.Global.updateSelectClass(target);

                    const options = select.find("option");
                    const parent = target.selectmenu("menuWidget");

                    options.each(function (index) {
                        let className = $(this).attr("class");

                        if (className) {
                            parent.find(".ui-menu-item").eq(index).addClass(className);
                        }
                    });
                },
                change: function (event, data) {
                    const key = data.item.value;

                    chart.updateSeries([
                        {
                            name: "Cumulative Leasing",
                            data: formatData(cls[key]),
                            type: 'line',
                        },
                        {
                            name: "Annual Savings",
                            data: as,
                            type: 'column',
                        },
                        {
                            name: "Leasing",
                            data: formatData(ls[key]),
                            type: 'column',
                        },
                    ], true).then(() => {
                        handleChartAnnotations(chart);
                    });
                },
                position: {
                    my: "left top",
                    at: "left bottom",
                    collision: "none",
                },
            });
        }

        const handleCounters = (self, stats) => {
            const items = self.find(".stat");
            if (!items.length) return;

            items.each(function () {
                const subSelf = $(this);
                const counter = subSelf.find("span");
                const key = subSelf.data("key");
                const amount = stats[key];

                gsap.fromTo(counter,
                    {
                        textContent: 0,
                    },
                    {
                        textContent: amount,
                        duration: 1.2,
                        snap: { textContent: 1 },
                        ease: "linear",
                        stagger: {
                            each: 0.3,
                            onUpdate: function () {
                                this.targets()[0].innerHTML = numberWithCommas(Math.ceil(this.targets()[0].textContent));
                            },
                        },
                        scrollTrigger: {
                            trigger: self,
                            start: "top 40%",
                        },
                    }
                )

                baunfire.Animation.orbAnimation(subSelf, subSelf.find(".orb"));
            });
        }

        const handleShareResult = (self) => {
            const el = self.find(".share-btn");
            if (!el.length) return;

            const siteURL = window.location.href;

            const showToast = (message) => {
                Toastify({
                    text: message,
                    duration: 3000,
                    close: true,
                    offset: {
                        y: '4em'
                    },
                    style: {
                        background: "#262626",
                    },
                    gravity: "bottom",
                    position: "center"
                }).showToast();
            };

            el.click(function () {
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(siteURL).then(() => {
                        showToast("URL copied to clipboard.");
                    }).catch(err => {
                        console.error(err);
                    });
                } else {
                    const tempInput = $('<input type="hidden">');
                    $('body').append(tempInput);
                    tempInput.val(siteURL).select();
                    document.execCommand('copy');
                    tempInput.remove();
                    showToast("URL copied to clipboard.");
                }
            });
        }

        const numberWithCommas = (x) => {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        const handleLottie = (container, el) => {
            if (!el.length) return;

            const path = el.data("json");
            if (!path.length) return;

            const animation = lottie.loadAnimation({
                container: el.get(0),
                renderer: "svg",
                loop: true,
                autoplay: false,
                path: path
            });

            ScrollTrigger.create({
                trigger: container,
                start: "top 60%",
                end: "bottom top",
                onEnter: () => animation.play(),
                onLeave: () => animation.pause(),
                onEnterBack: () => animation.play(),
                onLeaveBack: () => animation.pause()
            })
        }

        is404();
    }
});
