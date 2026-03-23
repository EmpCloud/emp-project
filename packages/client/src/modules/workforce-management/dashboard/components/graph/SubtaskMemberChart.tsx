import React, { Component } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5wc from '@amcharts/amcharts5/wc';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
let series;
class MembersChart extends Component {
    rootSubtaskMembersChart: am5.Root;
    constructor(props) {
        super(props);
        this.state = {
            category: this.props.Data,
        };
    }

    componentDidMount() {
        let rootSubtaskMembersChart = am5.Root.new('subtaskMembersChart');
        rootSubtaskMembersChart._logo.dispose();
        // Set themes
        // https://www.amcharts.com/docs/v5/concepts/themes/
        rootSubtaskMembersChart.setThemes([am5themes_Animated.new(rootSubtaskMembersChart)]);

        // Add series
        // https://www.amcharts.com/docs/v5/charts/word-cloud/
        series = rootSubtaskMembersChart.container.children.push(
            am5wc.WordCloud.new(rootSubtaskMembersChart, {
                maxCount: 30,
                minWordLength: 2,
                minFontSize: am5.percent(1),
                maxFontSize: am5.percent(4),
                angles: [0],
            })
        );

        let colorSet = am5.ColorSet.new(rootSubtaskMembersChart, { step: 1 });

        // Configure labels
        series.labels.template.setAll({
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 7,
            paddingRight: 7,
            fontFamily: 'mulish',
        });

        series.labels.template.setup = function (label) {
            label.set('background', am5.RoundedRectangle.new(rootSubtaskMembersChart, { fillOpacity: 1, fill: colorSet.next() }));
        };
        series.data.setAll(this.props.Data ?? []);

        this.rootSubtaskMembersChart = rootSubtaskMembersChart;
    }
    componentDidUpdate(prevProps) {
        if (prevProps.Data !== this.props.Data) {
            this.setState({ category: this.props.Data });
        }
        series.data.setAll(this.props.Data ?? []);
    }
    componentWillUnmount() {
        if (this.rootSubtaskMembersChart) {
            this.rootSubtaskMembersChart.dispose();
        }
    }

 
render() {
    const { Data } = this.props;
    const hasData = Data && Data.length >0;

    return (
        <div id='subtaskMembersChart' style={{ width: '100%', height: '400px' }}>
        {!hasData ? (
            <div className='dark:text-gray-50' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                No data available for this Sub Task
            </div>
        ) : (
            <div>
                {Data.map((item, index) => (
                    <div key={index}>{item.name}</div>
                ))}
            </div>
        )}
    </div>
);
}
}

export default MembersChart;
