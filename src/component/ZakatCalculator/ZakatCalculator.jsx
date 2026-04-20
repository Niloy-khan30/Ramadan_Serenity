import React, { useMemo, useState } from "react";

const NISAB = 87000; // approximate in BDT, you can adjust later

const ZakatCalculator = () => {
    const [formData, setFormData] = useState({
        cash: "",
        bankSavings: "",
        goldValue: "",
        silverValue: "",
        investments: "",
        businessAssets: "",
        moneyOwedToYou: "",
        liabilities: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const calculation = useMemo(() => {
        const cash = Number(formData.cash) || 0;
        const bankSavings = Number(formData.bankSavings) || 0;
        const goldValue = Number(formData.goldValue) || 0;
        const silverValue = Number(formData.silverValue) || 0;
        const investments = Number(formData.investments) || 0;
        const businessAssets = Number(formData.businessAssets) || 0;
        const moneyOwedToYou = Number(formData.moneyOwedToYou) || 0;
        const liabilities = Number(formData.liabilities) || 0;

        const totalAssets =
            cash +
            bankSavings +
            goldValue +
            silverValue +
            investments +
            businessAssets +
            moneyOwedToYou;

        const netZakatableWealth = totalAssets - liabilities;
        const isEligible = netZakatableWealth >= NISAB;
        const zakatAmount = isEligible ? netZakatableWealth * 0.025 : 0;

        return {
            totalAssets,
            netZakatableWealth,
            isEligible,
            zakatAmount,
        };
    }, [formData]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-black text-white px-4 py-10">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold mb-3">
                        Zakat Calculator
                    </h1>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        Calculate your zakat based on your zakatable assets, liabilities,
                        and nisab threshold.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-4">Enter Your Assets</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="number"
                                name="cash"
                                placeholder="Cash in hand"
                                value={formData.cash}
                                onChange={handleChange}
                                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white"
                            />

                            <input
                                type="number"
                                name="bankSavings"
                                placeholder="Bank savings"
                                value={formData.bankSavings}
                                onChange={handleChange}
                                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white"
                            />

                            <input
                                type="number"
                                name="goldValue"
                                placeholder="Gold value"
                                value={formData.goldValue}
                                onChange={handleChange}
                                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white"
                            />

                            <input
                                type="number"
                                name="silverValue"
                                placeholder="Silver value"
                                value={formData.silverValue}
                                onChange={handleChange}
                                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white"
                            />

                            <input
                                type="number"
                                name="investments"
                                placeholder="Investments"
                                value={formData.investments}
                                onChange={handleChange}
                                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white"
                            />

                            <input
                                type="number"
                                name="businessAssets"
                                placeholder="Business assets"
                                value={formData.businessAssets}
                                onChange={handleChange}
                                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white"
                            />

                            <input
                                type="number"
                                name="moneyOwedToYou"
                                placeholder="Money owed to you"
                                value={formData.moneyOwedToYou}
                                onChange={handleChange}
                                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white"
                            />

                            <input
                                type="number"
                                name="liabilities"
                                placeholder="Liabilities / debts"
                                value={formData.liabilities}
                                onChange={handleChange}
                                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white"
                            />
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-4">Zakat Summary</h2>

                        <div className="space-y-4">
                            <div className="bg-blue-500/20 rounded-xl p-4">
                                <p className="text-sm text-gray-300">Total Assets</p>
                                <p className="text-2xl font-bold">
                                    ৳ {calculation.totalAssets.toFixed(2)}
                                </p>
                            </div>

                            <div className="bg-purple-500/20 rounded-xl p-4">
                                <p className="text-sm text-gray-300">Net Zakatable Wealth</p>
                                <p className="text-2xl font-bold">
                                    ৳ {calculation.netZakatableWealth.toFixed(2)}
                                </p>
                            </div>

                            <div className="bg-yellow-500/20 rounded-xl p-4">
                                <p className="text-sm text-gray-300">Nisab Threshold</p>
                                <p className="text-2xl font-bold">৳ {NISAB.toFixed(2)}</p>
                            </div>

                            <div
                                className={`rounded-xl p-4 ${calculation.isEligible
                                    ? "bg-green-500/20"
                                    : "bg-red-500/20"
                                    }`}
                            >
                                <p className="text-sm text-gray-300">Eligibility</p>
                                <p className="text-2xl font-bold">
                                    {calculation.isEligible
                                        ? "Eligible for Zakat"
                                        : "Not Eligible for Zakat"}
                                </p>
                            </div>

                            <div className="bg-emerald-500/20 rounded-xl p-4 text-center">
                                <p className="text-sm text-gray-300">Zakat to Pay (2.5%)</p>
                                <p className="text-4xl font-bold text-green-400 mt-2">
                                    ৳ {calculation.zakatAmount.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ZakatCalculator;