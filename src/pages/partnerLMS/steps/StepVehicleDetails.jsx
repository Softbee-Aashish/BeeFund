import React from 'react';

const StepVehicleDetails = ({ formData, updateFormData }) => {
    const veh = formData.vehicleDetails || {
        vehicleType: 'Commercial Truck / Prime Mover (HCV)',
        vehicleUsage: 'Commercial Logistics & Fleet Operations',
        makeAndModel: 'Tata Signa 4825.TK 16-Wheeler Tipper',
        dealerName: 'Apex Commercial Motors Pvt Ltd',
        exShowroomPriceLakhs: 48.5,
        onRoadPriceLakhs: 54.0,
        downPaymentLakhs: 10.0,
        fleetSizeExisting: 6,
        commercialPermitType: 'National All-India Permit',
        routeDetails: 'Delhi NCR - Gujarat - Maharashtra Industrial Corridor'
    };

    const updateVeh = (field, value) => {
        const updated = { ...veh, [field]: value };
        updateFormData({ vehicleDetails: updated });
    };

    const onRoad = parseFloat(veh.onRoadPriceLakhs) || 50.0;
    const downPayment = parseFloat(veh.downPaymentLakhs) || 10.0;
    const loanRequired = Math.max(0, onRoad - downPayment);
    const vehicleLTV = (loanRequired / onRoad) * 100;

    return (
        <div className="lms-step-container">
            <div className="step-header">
                <h3>Step: Vehicle Specifications, Dealer Quotation & Fleet Profile</h3>
                <p>Provide vehicle make and model, dealer proforma, commercial permit details, and on-road price financing.</p>
            </div>

            <div className="step-form-grid">
                <div className="form-field">
                    <label>Vehicle Category *</label>
                    <select
                        value={veh.vehicleType || 'Commercial Truck / Prime Mover (HCV)'}
                        onChange={(e) => updateVeh('vehicleType', e.target.value)}
                    >
                        <option value="Commercial Truck / Prime Mover (HCV)">Commercial Truck / Heavy Commercial (HCV)</option>
                        <option value="Light Commercial Vehicle (LCV / Pickup)">Light Commercial Vehicle (LCV / Pickup)</option>
                        <option value="Bus / Staff Transport Fleet">Bus / Staff Transport Fleet</option>
                        <option value="Earthmoving & Construction Equipment (JCB/Excavator)">Earthmoving / Construction Equipment (JCB)</option>
                        <option value="Passenger Car (Personal / Salaried)">Passenger Car (Personal / Salaried)</option>
                        <option value="Luxury / Premium Vehicle">Luxury / Premium Vehicle</option>
                    </select>
                </div>

                <div className="form-field">
                    <label>Vehicle Make & Specific Model *</label>
                    <input
                        type="text"
                        value={veh.makeAndModel || ''}
                        onChange={(e) => updateVeh('makeAndModel', e.target.value)}
                        placeholder="e.g. Tata Signa 4825 / Ashok Leyland Ecomet"
                        required
                    />
                </div>

                <div className="form-field col-2">
                    <label>Authorized Dealer / Showroom Name *</label>
                    <input
                        type="text"
                        value={veh.dealerName || ''}
                        onChange={(e) => updateVeh('dealerName', e.target.value)}
                        placeholder="e.g. Apex Commercial Motors Ltd, Transport Nagar"
                    />
                </div>

                <div className="form-field">
                    <label>Ex-Showroom Price (₹ in Lakhs) *</label>
                    <input
                        type="number"
                        step="0.1"
                        value={veh.exShowroomPriceLakhs || ''}
                        onChange={(e) => updateVeh('exShowroomPriceLakhs', parseFloat(e.target.value) || 0)}
                        placeholder="e.g. 48.5"
                    />
                </div>

                <div className="form-field">
                    <label>On-Road Price (including RTO + Insurance) (₹ Lakhs) *</label>
                    <input
                        type="number"
                        step="0.1"
                        value={veh.onRoadPriceLakhs || ''}
                        onChange={(e) => updateVeh('onRoadPriceLakhs', parseFloat(e.target.value) || 0)}
                        placeholder="e.g. 54.0"
                    />
                </div>

                <div className="form-field">
                    <label>Customer Down Payment (₹ Lakhs) *</label>
                    <input
                        type="number"
                        step="0.1"
                        value={veh.downPaymentLakhs || ''}
                        onChange={(e) => updateVeh('downPaymentLakhs', parseFloat(e.target.value) || 0)}
                        placeholder="e.g. 10.0"
                    />
                </div>

                <div className="form-field">
                    <label>Existing Fleet Size (Vehicles Owned)</label>
                    <input
                        type="number"
                        value={veh.fleetSizeExisting || ''}
                        onChange={(e) => updateVeh('fleetSizeExisting', parseInt(e.target.value) || 0)}
                        placeholder="e.g. 5"
                    />
                </div>

                <div className="form-field col-2">
                    <label>Operational Route / Freight Anchor Client</label>
                    <input
                        type="text"
                        value={veh.routeDetails || ''}
                        onChange={(e) => updateVeh('routeDetails', e.target.value)}
                        placeholder="e.g. Dedicated contract with e-commerce / cement freight"
                    />
                </div>
            </div>

            {/* Vehicle Loan Calculation Banner */}
            <div className="finance-balance-banner balanced" style={{ marginTop: '1.5rem' }}>
                <div className="balance-col">
                    <span>On-Road Price</span>
                    <h3>₹{onRoad.toFixed(2)} Lakhs</h3>
                </div>
                <div className="balance-col">
                    <span>Down Payment ({(100 - vehicleLTV).toFixed(1)}%)</span>
                    <h3>₹{downPayment.toFixed(2)} Lakhs</h3>
                </div>
                <div className="balance-col text-right">
                    <span>Financed Loan Amount</span>
                    <h3 className="text-gold">₹{loanRequired.toFixed(2)} Lakhs ({vehicleLTV.toFixed(0)}% LTV)</h3>
                </div>
            </div>
        </div>
    );
};

export default StepVehicleDetails;
