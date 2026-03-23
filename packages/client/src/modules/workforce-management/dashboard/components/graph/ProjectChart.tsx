import React, { useRef, useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

function ProjectChart({Data}) {
  useLayoutEffect(() => {
    let root = am5.Root.new("chartdiv");
    root._logo.dispose();

    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    var chart = root.container.children.push(am5xy.XYChart.new(root, {}));
    // hide grid
    chart.gridContainer.set("opacity", 0);

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    var xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 0,
          inside: true,
        }),
        min: 0,
        max: 12,
        strictMinMax: true,
        opacity: 0,
      })
    );

    var yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {
          inside: true,
          inversed: true,
        }),
        min: -1,
        max: 9,
        strictMinMax: true,
        opacity: 0,
      })
    );

    // Create series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    var series = chart.series.push(
      am5xy.LineSeries.new(root, {
        calculateAggregates: true,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "y",
        valueXField: "x",
        valueField: "value",
      })
    );

    // Add bullet
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Bullets
    var circleTemplate = am5.Template.new({});
    series.bullets.push(function () {
      var graphics = am5.Circle.new(
        root,
        {
          fill: series.get("fill"),
          tooltipText: "{name} {data.projectstatus}",
          tooltipY: -am5.p50,
        },
        circleTemplate
      );

      // we use adapter for x as radius will be called only once and x will be called each time position changes
      graphics.adapters.add("x", function (x, target) {
        // find which gap between values is smaller, x or y and set half of it for radius
        target.set(
          "radius",
          Math.min(
            Math.abs(xAxis.getX(0, 1, 0) - xAxis.getX(1, 1, 0)),
            Math.abs(yAxis.getY(0, 1, 0) - yAxis.getY(1, 1, 0))
          ) / 2
        );
        // return original x
        return x;
      });

      return am5.Bullet.new(root, {
        sprite: graphics,
      });
    });

    // another bullet for label
    series.bullets.push(function () {
      var label = am5.Label.new(root, {
        populateText: true,
        centerX: am5.p50,
        centerY: am5.p50,
        text: "{short}",
      });

      return am5.Bullet.new(root, {
        sprite: label,
      });
    });

    series.set("heatRules", [
      {
        target: circleTemplate,
        min: am5.color(0xfffb77),
        max: am5.color(0xfe131a),
        dataField: "value",
        key: "fill",
      },
    ]);

    series.strokes.template.set("strokeOpacity", 0);

  var data = [
    Data,
  ]
    // loop through all items and add 0,5 to all items in odd rows
    am5.array.each(Data, function (di) {
      if (di.y / 2 == Math.round(di.y / 2)) {
        di.x += 0.5;
      }
    });

    series.data.setAll(Data);

    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    series.appear(1000);

    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [Data]);

  return <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>;
}

export default ProjectChart;
