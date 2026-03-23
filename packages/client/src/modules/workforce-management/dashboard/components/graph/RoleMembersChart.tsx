import React, { Component } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5wc from '@amcharts/amcharts5/wc';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
let series;
class MembersChart extends Component {
    rootRoleMembersChart: am5.Root;
    constructor(props) {
        super(props);
        this.state = {
            category: this.props.Data,
        };
    }

    componentDidMount() {
        let rootRoleMembersChart = am5.Root.new('roleMembersChart');
        rootRoleMembersChart._logo.dispose();
        // Set themes
        // https://www.amcharts.com/docs/v5/concepts/themes/
        rootRoleMembersChart.setThemes([am5themes_Animated.new(rootRoleMembersChart)]);

        // Add series
        // https://www.amcharts.com/docs/v5/charts/word-cloud/
        series = rootRoleMembersChart.container.children.push(
            am5wc.WordCloud.new(rootRoleMembersChart, {
                maxCount: 30,
                minWordLength: 2,
                minFontSize: am5.percent(1),
                maxFontSize: am5.percent(4),
                angles: [0],
            })
        );

        let colorSet = am5.ColorSet.new(rootRoleMembersChart, { step: 1 });

        // Configure labels
        series.labels.template.setAll({
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 7,
            paddingRight: 7,
            fontFamily: 'mulish',
        });

        series.labels.template.setup = function (label) {
            label.set('background', am5.RoundedRectangle.new(rootRoleMembersChart, { fillOpacity: 1, fill: colorSet.next() }));
        };
        series.data.setAll(this?.props?.Data ?? []);

        this.rootRoleMembersChart = rootRoleMembersChart;
    }
    componentDidUpdate(prevProps) {
        if (prevProps.Data !== this.props.Data) {
            this.setState({ category: this.props.Data });
        }
        series.data.setAll(this.props.Data ?? []);
    }
    componentWillUnmount() {
        if (this.rootRoleMembersChart) {
            this.rootRoleMembersChart.dispose();
        }
    }

    render() {
        return <div id='roleMembersChart' style={{ width: '100%', height: '400px' }}></div>;
    }
}

export default MembersChart;
