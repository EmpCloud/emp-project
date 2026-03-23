import { Responsive, WidthProvider } from "react-grid-layout";
import styled from "styled-components";
const layout = [
    { i: "tt1", x: 0, y: 0, w: 12, h: 1 },
    { i: "t1", x: 1, y: 0, w: 5, h: 1 },
    { i: "t2", x: 2, y: 0, w: 5, h: 1 },
    { i: "t3", x: 3, y: 0, w: 1, h: 1 },
    { i: "t4", x: 4, y: 0, w: 90, h: 90 },
    { i: "t5", x: 4, y: 0, w: 1, h: 1 },
    { i: "t6", x: 1, y: 0, w: 1, h: 1 },
    { i: "t7", x: 2, y: 0, w: 1, h: 1 },
    { i: "t8", x: 3, y: 0, w: 1, h: 1 },
    { i: "t9", x: 4, y: 0, w: 1, h: 1 },
    { i: "t10", x: 4, y: 0, w: 1, h: 1 },
];
const GridItemWrapper = styled.div`
  background: #f5f5f5;
`;
const GridItemContent = styled.div`
  padding: 0px;
`;
const Root = styled.div`
  padding: 0px;
`;
const ResponsiveGridLayout = WidthProvider(Responsive);
const getLayouts = () => {
    if (typeof window !== 'undefined') {
        const savedLayouts = localStorage.getItem("grid-layout");
        return savedLayouts ? JSON.parse(savedLayouts) : { lg: layout };
    }
};
export const Grid = () => {
    const handleLayoutChange = (layout, layouts) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem("grid-layout", JSON.stringify(layouts));
        }
    };
    return (
        <Root>
            <ResponsiveGridLayout
                layouts={getLayouts()}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 5, md: 4, sm: 3, xs: 2, xxs: 1 }}
                rowHeight={"100%"}
                width={"100%"}
                isDragable={true}
                isResizable={true}
                onLayoutChange={handleLayoutChange}
                onResizeStop={function (e, layout) {
                }}
            >
                {/* <GridLayout layout={layout} cols={5} rowHeight={300} width={1200}> */}
                <GridItemWrapper key="tt1">
                    <GridItemContent>TT1</GridItemContent>
                </GridItemWrapper>
                <GridItemWrapper key="t1">
                    <GridItemContent>TEST1</GridItemContent>
                </GridItemWrapper>
                <GridItemWrapper key="t2">
                    <GridItemContent>TEST2</GridItemContent>
                </GridItemWrapper>
                <GridItemWrapper key="t3">
                    <GridItemContent>TEST3</GridItemContent>
                </GridItemWrapper>
                <GridItemWrapper key="t4">
                    <GridItemContent>TEST4</GridItemContent>
                </GridItemWrapper>       <GridItemWrapper key="t5">
                    <GridItemContent>TEST5</GridItemContent>
                </GridItemWrapper>
                <GridItemWrapper key="t6">
                    <GridItemContent>TEST6</GridItemContent>
                </GridItemWrapper>
                <GridItemWrapper key="t7">
                    <GridItemContent>TEST7</GridItemContent>
                </GridItemWrapper>
                <GridItemWrapper key="t8">
                    <GridItemContent>TEST8</GridItemContent>
                </GridItemWrapper>
                <GridItemWrapper key="t9">
                    <GridItemContent>TEST9</GridItemContent>
                </GridItemWrapper>
                <GridItemWrapper key="t10">
                    <GridItemContent>TEST10</GridItemContent>
                </GridItemWrapper>
                {/* </GridLayout> */}
            </ResponsiveGridLayout>
        </Root>
    );
};
export default Grid;
