import { portfolioPresenter$ } from "../modules/Portfolio/PortfolioPresenter";
import { observer } from "@legendapp/state/react";
import { DonutChart } from "./DonutChart/DonutChart";
import { PositionsTable } from "./PositionsTable/PositionsTable";

export const Main = observer(() => {
    const positionData = portfolioPresenter$.positions();
    const isGroupByAssetType = portfolioPresenter$.groupByAssetType.get();

    return (
        <div className="width-full p-4">
            <h1 className="text-4xl font-bold text-center">
                Portfolio
            </h1>
            <p className="text-center">
                Check out your assets and positions
            </p>
            <div className="flex align-center justify-between mt-16">
                <h2 className="text-2xl font-bold">Portfolio</h2>
                <div>
                    <button
                        onClick={portfolioPresenter$.toggleGroupByAssetType}
                    >
                        {portfolioPresenter$.groupByAssetType.get()
                            ? "Ungroup"
                            : "Group by asset type"}
                    </button>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-4 mt-8">
                <DonutChart className="flex-1" data={positionData} />
                <PositionsTable
                    className="flex-1"
                    data={positionData}
                    grouped={isGroupByAssetType}
                />
            </div>
        </div>
    );
});
