const fs = require('fs');

// 1. Read existing inventory (all 330 items)
let existingInventory = [];
if (fs.existsSync('data/inventory.json')) {
  existingInventory = JSON.parse(fs.readFileSync('data/inventory.json', 'utf8'));
}

console.log('Existing inventory items count:', existingInventory.length);

// 2. Define the new items from Cupboard 56, Cupboard 67, and Cupboard 40
const cupboard56Data = [
  { name: 'Boiling Tubes (23 × 150 mm)', qty: '2', unit: 'pcs', category: 'Glassware', formula: 'Borosilicate', formulaPlain: 'Borosilicate', notes: 'Cupboard 56 - Student sample storage rows above' },
  { name: 'Boiling Tubes (14 × 150 mm)', qty: '1', unit: 'pc', category: 'Glassware', formula: 'Borosilicate', formulaPlain: 'Borosilicate', notes: 'Cupboard 56' },
  { name: 'Bottle of Baking Powder', qty: '1', unit: 'bottle', category: 'Chemical', formula: 'NaHCO₃', formulaPlain: 'NaHCO3', notes: 'Sodium bicarbonate formulation for lab demonstrations' },
  { name: 'Bottle of Vinegar', qty: '2', unit: 'bottles', category: 'Chemical', formula: 'CH₃COOH (5%)', formulaPlain: 'CH3COOH', notes: 'Dilute acetic acid solution' },
  { name: 'Buchner Flask (1000 mL)', qty: '1', unit: 'pc', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', notes: 'Heavy wall vacuum filtering flask with side tubulation' },
  { name: 'Coconut Oil Bottle', qty: '1', unit: 'bottle', category: 'Chemical', formula: 'Organic Oil', formulaPlain: 'Organic Oil', notes: 'Natural fatty acid triglyceride solvent/substrate' },
  { name: 'Domba Oil Bottle (180 mL)', qty: '1', unit: 'bottle (180 mL)', category: 'Chemical', formula: 'Calophyllum inophyllum seed oil', formulaPlain: 'Natural Oil', notes: 'Natural seed oil extract' },
  { name: 'Empty Glass Bottles', qty: '6', unit: 'bottles', category: 'Glassware', formula: 'Glass', formulaPlain: 'Glass', notes: 'Storage / reagent glass bottles' },
  { name: 'Formic Acid (500 mL)', qty: '1', unit: 'bottle (500 mL)', category: 'Chemical', formula: 'HCOOH', formulaPlain: 'HCOOH', notes: 'Methanoic acid 500 mL' },
  { name: 'Glass Stopper Bottles', qty: '2', unit: 'bottles', category: 'Glassware', formula: 'Glass', formulaPlain: 'Glass', notes: 'Ground glass stopper storage bottles' },
  { name: 'Glycerin Bottle (60 mL)', qty: '1', unit: 'bottle (60 mL)', category: 'Chemical', formula: 'C₃H₈O₃', formulaPlain: 'C3H8O3', notes: 'Glycerol 60 mL triol' },
  { name: 'Hydrogen Peroxide Bottle (200 mL)', qty: '1', unit: 'bottle (200 mL)', category: 'Chemical', formula: 'H₂O₂', formulaPlain: 'H2O2', notes: 'Hydrogen peroxide solution 200 mL' },
  { name: 'Lactic Acid Bottle (500 mL)', qty: '1', unit: 'bottle (500 mL)', category: 'Chemical', formula: 'C₃H₆O₃', formulaPlain: 'C3H6O3', notes: '2-Hydroxypropanoic acid 500 mL' },
  { name: 'Measuring Cylinder (10 mL)', qty: '1', unit: 'pc', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', notes: 'Graduated measuring cylinder 10 mL' },
  { name: 'Mee Oil Bottle (60 mL)', qty: '1', unit: 'bottle (60 mL)', category: 'Chemical', formula: 'Madhuca longifolia oil', formulaPlain: 'Natural Oil', notes: 'Natural seed oil 60 mL' },
  { name: 'Methanol Bottle', qty: '2', unit: 'bottles', category: 'Chemical', formula: 'CH₃OH', formulaPlain: 'CH3OH', notes: 'Methyl alcohol bottles' },
  { name: 'MgSO₄ Bottle (Packet Made)', qty: '1', unit: 'bottle', category: 'Chemical', formula: 'MgSO₄', formulaPlain: 'MgSO4', notes: 'Magnesium Sulphate (Packet Made)' },
  { name: 'n-Butanol Bottle', qty: '1', unit: 'bottle', category: 'Chemical', formula: 'C₄H₉OH', formulaPlain: 'C4H9OH', notes: '1-Butanol alcohol solvent' },
  { name: 'Pack of Yeast', qty: '1', unit: 'pack', category: 'Chemical', formula: 'Biological Reagent', formulaPlain: 'Yeast', notes: 'Saccharomyces cerevisiae culture reagent' },
  { name: 'S-lon Glue Bottle', qty: '1', unit: 'bottle', category: 'Equipment', formula: 'Adhesive / Solvent cement', formulaPlain: 'Adhesive', notes: 'Solvent cement adhesive for PVC and lab fittings' },
  { name: 'Test Tubes Small (8 × 75 mm)', qty: '9', unit: 'pcs', category: 'Glassware', formula: 'Borosilicate', formulaPlain: 'Borosilicate', notes: 'Micro test tubes 8 × 75 mm' },
  { name: 'Test Tubes Small (10 × 98 mm)', qty: '1', unit: 'pc', category: 'Glassware', formula: 'Borosilicate', formulaPlain: 'Borosilicate', notes: 'Small test tube 10 × 98 mm' },
  { name: 'Titanium Tetra Isopropoxide (500 mL)', qty: '1', unit: 'bottle (500 mL)', category: 'Chemical', formula: 'Ti[OCH(CH₃)₂]₄', formulaPlain: 'Ti[OCH(CH3)2]4', notes: 'TTIP titanium precursor 500 mL' },
  { name: 'Titanium(IV) Isopropoxide (500 mL)', qty: '1', unit: 'bottle (500 mL)', category: 'Chemical', formula: 'Ti[OCH(CH₃)₂]₄', formulaPlain: 'Ti[OCH(CH3)2]4', notes: 'Titanium(IV) isopropoxide 500 mL' },
  { name: 'Volumetric Flask (100 mL)', qty: '1', unit: 'pc', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', notes: 'Class A volumetric flask 100 mL' },
  { name: 'Volumetric Flask (25 mL)', qty: '2', unit: 'pcs', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', notes: 'Class A volumetric flask 25 mL' }
];

const cupboard67Data = [
  { name: 'Test Tube (10 × 100 mm)', qty: '100', unit: 'pcs', category: 'Glassware', formula: 'Borosilicate', formulaPlain: 'Borosilicate', notes: 'Batch of 100 test tubes' },
  { name: 'Test Tube (16 × 160 mm)', qty: '100', unit: 'pcs', category: 'Glassware', formula: 'Borosilicate', formulaPlain: 'Borosilicate', notes: 'Batch of 100 medium test tubes' },
  { name: 'Beaker 100 mL', qty: '11', unit: 'pcs', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', notes: 'Graduated low form 100 mL beakers' },
  { name: 'Beaker 20 mL', qty: '10', unit: 'pcs', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', notes: 'Small scale 20 mL beakers' },
  { name: 'Beaker 40 mL', qty: '10', unit: 'pcs', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', notes: 'Small scale 40 mL beakers' },
  { name: 'AUTOLAB Items & Electrochemical Cell Accessories', qty: '1', unit: 'set', category: 'Equipment', formula: 'Electrochemical', formulaPlain: 'Electrochemical', notes: 'Potentiostat / Galvanostat accessories and electrodes' },
  { name: 'Black Cell Cuvette', qty: '1', unit: 'pc', category: 'Equipment', formula: 'Optical Glass', formulaPlain: 'Optical Glass', notes: 'Masked black-wall spectrophotometer cuvette' },
  { name: 'Quartz Cuvettes (UV-Vis)', qty: '4', unit: 'pcs', category: 'Equipment', formula: 'Fused Quartz (SiO₂)', formulaPlain: 'Fused Quartz', notes: 'Far UV-Vis quartz cuvettes 190–2500 nm' },
  { name: 'Digital Oscilloscope Manual & Documentation', qty: '1', unit: 'unit', category: 'Equipment', formula: 'Electronic Manual', formulaPlain: 'Manual', notes: 'Operation and calibration manual for digital oscilloscope' },
  { name: 'Face Masks Pack', qty: '1', unit: 'pack', category: 'Equipment', formula: 'PPE Polypropylene', formulaPlain: 'PPE', notes: 'Protective 3-ply laboratory face masks' },
  { name: 'Hot Disk Thermal Conductivity Probe', qty: '3', unit: 'units', category: 'Equipment', formula: 'Sensor / Sensor Wire', formulaPlain: 'Sensor', notes: 'Transient plane source thermal constants probe' },
  { name: 'IPCE USB Interface Cable', qty: '1', unit: 'unit', category: 'Equipment', formula: 'Electronic Cable', formulaPlain: 'Cable', notes: 'Incident Photon-to-Current Conversion Efficiency interface cable' },
  { name: 'Laboratory Computer Keyboard', qty: '1', unit: 'unit', category: 'Equipment', formula: 'Peripheral', formulaPlain: 'Peripheral', notes: 'Data acquisition workstation keyboard' },
  { name: 'Micropipette Operation Manual', qty: '1', unit: 'unit', category: 'Equipment', formula: 'Documentation', formulaPlain: 'Manual', notes: 'Calibration and maintenance manual' },
  { name: 'Laboratory Computer Mouse', qty: '1', unit: 'unit', category: 'Equipment', formula: 'Peripheral', formulaPlain: 'Peripheral', notes: 'Data acquisition optical mouse' },
  { name: 'MPLAB Microcontroller Chips & Accessories', qty: '1', unit: 'set', category: 'Equipment', formula: 'Semiconductor / IC', formulaPlain: 'Semiconductor', notes: 'Development kit, PIC chips, and debug adapters' },
  { name: 'NEC Projector', qty: '1', unit: 'unit', category: 'Equipment', formula: 'Optical / Electronic', formulaPlain: 'Projector', notes: 'Seminar and lab projection unit' },
  { name: 'Petri Dishes Glass (Cupboard 67)', qty: '1', unit: 'set', category: 'Glassware', formula: 'Borosilicate', formulaPlain: 'Borosilicate', notes: 'Cell culture and sample crystallization dishes' },
  { name: 'EUTECH pH Meter Accessories & Probes', qty: '1', unit: 'set', category: 'Equipment', formula: 'Electrochemical Cell', formulaPlain: 'pH Electrode', notes: 'Replacement electrode, BNC cable, and storage cap' },
  { name: 'UPS (Uninterruptible Power Supply)', qty: '8', unit: 'units', category: 'Equipment', formula: 'Power Supply / Battery', formulaPlain: 'UPS', notes: 'Backup power units for analytical instruments' },
  { name: 'VGA Cables (D-Sub High Density)', qty: '1', unit: 'pc', category: 'Equipment', formula: 'Display Cable', formulaPlain: 'VGA Cable', notes: 'Video connection cable' },
  { name: 'Xenon Arc Lamp (Solar Simulator / UV-Vis Source)', qty: '1', unit: 'unit', category: 'Equipment', formula: 'Xenon Gas / Quartz', formulaPlain: 'Xe Lamp', notes: 'High intensity solar simulation arc lamp' }
];

const cupboard40Data = [
  { name: 'Blue Litmus Paper (Pack of 200)', qty: '1', unit: 'pack (200 strips)', category: 'Equipment', formula: 'Litmus / Cellulose', formulaPlain: 'Litmus Paper', notes: 'Opened pack - Acid-base indicator paper for base detection' },
  { name: 'Buchner Flask (1000 mL)', qty: '3', unit: 'pcs', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', notes: 'Heavy wall vacuum filtering flasks 1000 mL' },
  { name: 'Buchner Flask (500 mL)', qty: '2', unit: 'pcs', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', notes: 'Heavy wall vacuum filtering flasks 500 mL' },
  { name: 'Burette with Stopcock', qty: '1', unit: 'pc', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', notes: 'Class A precision titration burette' },
  { name: 'Centrifuge Tubes Glass/Plastic', qty: '1', unit: 'set', category: 'Glassware', formula: 'Borosilicate / PP', formulaPlain: 'Glass / PP', notes: 'Graduated centrifuge tubes' },
  { name: 'Citric Acid (500 g)', qty: '1', unit: 'bottle (500 g)', category: 'Chemical', formula: 'C₆H₈O₇', formulaPlain: 'C6H8O7', notes: '2-Hydroxypropane-1,2,3-tricarboxylic acid 500 g' },
  { name: 'Conical Flask (100 mL)', qty: '4', unit: 'pcs', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', notes: 'Erlenmeyer flasks 100 mL' },
  { name: 'Conical Flask (1000 mL)', qty: '4', unit: 'pcs', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', notes: 'Erlenmeyer flasks 1000 mL' },
  { name: 'Conical Flask (250 mL)', qty: '9', unit: 'pcs', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', notes: 'Erlenmeyer flasks 250 mL' },
  { name: 'Conical Flask (50 mL)', qty: '4', unit: 'pcs', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', notes: 'Erlenmeyer flasks 50 mL' },
  { name: 'Crucible (30 mL)', qty: '1', unit: 'pc', category: 'Glassware', formula: 'Porcelain', formulaPlain: 'Porcelain', notes: 'Glazed porcelain crucible for high temperature heating' },
  { name: 'Crucible Tongs', qty: '1', unit: 'pc', category: 'Equipment', formula: 'Stainless Steel', formulaPlain: 'Stainless Steel', notes: 'Bowed jaw stainless steel tongs for handling hot crucibles' },
  { name: 'Dropping Bottle (30 mL)', qty: '1', unit: 'pc', category: 'Glassware', formula: 'Glass', formulaPlain: 'Glass', notes: 'Indicator dropping bottle with pipette dropper' },
  { name: 'FTO Glass Substrates (Standard)', qty: '14', unit: 'pcs', category: 'Equipment', formula: 'SnO₂:F on Glass', formulaPlain: 'SnO2:F / Glass', notes: 'Fluorine-doped Tin Oxide transparent conductive glass' },
  { name: 'FTO Glass Substrates (4 cm × 9 cm)', qty: '1', unit: 'pc', category: 'Equipment', formula: 'SnO₂:F on Glass', formulaPlain: 'SnO2:F / Glass', notes: 'Large size 4 cm × 9 cm conductive FTO substrate' },
  { name: 'Glass Funnel (50 mm)', qty: '4', unit: 'pcs', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', notes: '60 degree angle conical filtration funnels' },
  { name: 'Glass Pasteur Pipettes', qty: '1', unit: 'box', category: 'Glassware', formula: 'Soda Glass', formulaPlain: 'Soda Glass', notes: 'Fine tip uncalibrated transfer pipettes' },
  { name: 'Glass Stopper Bottles', qty: '2', unit: 'bottles', category: 'Glassware', formula: 'Glass', formulaPlain: 'Glass', notes: 'Ground neck reagent storage bottles' },
  { name: 'Liebig Condenser & Distillation Set', qty: '1', unit: 'set', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', notes: 'Distillation set with Liebig condenser and adapters' },
  { name: 'Measuring Cylinder (10 mL)', qty: '6', unit: 'pcs', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', notes: 'Graduated 10 mL measuring cylinders' },
  { name: 'Measuring Cylinder (100 mL)', qty: '9', unit: 'pcs', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', notes: 'Graduated 100 mL measuring cylinders' },
  { name: 'Measuring Cylinder (25 mL)', qty: '9', unit: 'pcs', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', notes: 'Graduated 25 mL measuring cylinders' },
  { name: 'Measuring Cylinder (50 mL)', qty: '6', unit: 'pcs', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', notes: 'Graduated 50 mL measuring cylinders' },
  { name: 'Mee Oil Bottle (60 mL)', qty: '1', unit: 'bottle (60 mL)', category: 'Chemical', formula: 'Madhuca longifolia oil', formulaPlain: 'Natural Oil', notes: 'Natural seed oil bottle' },
  { name: 'Methanol Bottle', qty: '2', unit: 'bottles', category: 'Chemical', formula: 'CH₃OH', formulaPlain: 'CH3OH', notes: 'Methyl alcohol reagent bottles' },
  { name: 'Microscope Slides (Opened pack)', qty: '<72', unit: 'slides', category: 'Equipment', formula: 'Soda-Lime Glass', formulaPlain: 'Glass', notes: 'Opened pack (<72 slides) - 25 × 75 mm optical clear' },
  { name: 'Microscope Slides (72-pack Sealed)', qty: '1', unit: 'pack (72 slides)', category: 'Equipment', formula: 'Soda-Lime Glass', formulaPlain: 'Glass', notes: 'Full sealed box of 72 microscope glass slides' },
  { name: 'n-Butanol Bottle', qty: '1', unit: 'bottle', category: 'Chemical', formula: 'C₄H₉OH', formulaPlain: 'C4H9OH', notes: '1-Butanol alcohol solvent bottle' },
  { name: 'Pen Type Digital pH Meter', qty: '2', unit: 'units', category: 'Equipment', formula: 'Electronic', formulaPlain: 'Electronic', notes: 'Pocket digital pen-type pH tester' },
  { name: 'Petri Dishes Glass (Cupboard 40)', qty: '7', unit: 'pairs', category: 'Glassware', formula: 'Borosilicate', formulaPlain: 'Borosilicate', notes: 'Borosilicate glass culture and drying dishes' },
  { name: 'Petri Dishes (10 × 2 cm)', qty: '1', unit: 'set', category: 'Glassware', formula: 'Borosilicate', formulaPlain: 'Borosilicate', notes: 'Large diameter 10 × 2 cm glass petri dishes' },
  { name: 'pH 6.86 Calibration Buffer Powder', qty: '1', unit: 'packet', category: 'Chemical', formula: 'KH₂PO₄ + Na₂HPO₄', formulaPlain: 'KH2PO4 + Na2HPO4', notes: 'Precision phosphate buffer for pH electrode calibration at 25°C' },
  { name: 'Plastic Buchner Funnel', qty: '6', unit: 'pcs', category: 'Equipment', formula: 'Polypropylene', formulaPlain: 'PP', notes: 'Chemical resistant polypropylene vacuum filtration funnels' },
  { name: 'Plastic Petri Dish', qty: '2', unit: 'pcs', category: 'Equipment', formula: 'Polystyrene', formulaPlain: 'PS', notes: 'Sterile disposable culture dishes' },
  { name: 'Porcelain Mortar', qty: '1', unit: 'pc', category: 'Glassware', formula: 'Porcelain', formulaPlain: 'Porcelain', notes: 'Solid heavy glazed porcelain grinding bowl' },
  { name: 'Porcelain Pestle (15 mm)', qty: '1', unit: 'pc', category: 'Glassware', formula: 'Porcelain', formulaPlain: 'Porcelain', notes: 'Unglazed grinding head pestle' },
  { name: 'Red Litmus Paper (Pack of 200)', qty: '1', unit: 'pack (200 strips)', category: 'Equipment', formula: 'Litmus / Cellulose', formulaPlain: 'Litmus Paper', notes: 'Acid-base indicator paper for base detection' },
  { name: 'Separation Funnel (125 mL)', qty: '2', unit: 'pcs', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', notes: 'Pear shaped extraction funnel with PTFE key' },
  { name: 'Separation Funnel (60 mL)', qty: '2', unit: 'pcs', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', notes: 'Small scale extraction funnels 60 mL' },
  { name: 'Silver Nitrate (25 g)', qty: '1', unit: 'bottle (25 g)', category: 'Chemical', formula: 'AgNO₃', formulaPlain: 'AgNO3', notes: 'Analytical reagent grade silver nitrate crystals 25 g' },
  { name: 'Surgical Blades (Sterile Carbon Steel)', qty: '8', unit: 'pcs', category: 'Equipment', formula: 'Carbon Steel', formulaPlain: 'Carbon Steel', notes: 'Sterile surgical cutting blades for substrate and film slicing' },
  { name: 'Test Tube (12 × 150 mm)', qty: '24', unit: 'pcs', category: 'Glassware', formula: 'Borosilicate', formulaPlain: 'Borosilicate', notes: 'Standard test tubes 12 × 150 mm' },
  { name: 'Test Tube (15 × 150 mm)', qty: '100', unit: 'pcs', category: 'Glassware', formula: 'Borosilicate', formulaPlain: 'Borosilicate', notes: 'Standard test tubes 15 × 150 mm' },
  { name: 'Test Tube (18 × 150 mm)', qty: '1', unit: 'rack', category: 'Glassware', formula: 'Borosilicate', formulaPlain: 'Borosilicate', notes: 'Medium test tubes 18 × 150 mm' },
  { name: 'Test Tube (18 × 180 mm)', qty: '1', unit: 'rack', category: 'Glassware', formula: 'Borosilicate', formulaPlain: 'Borosilicate', notes: 'Long test tubes 18 × 180 mm' },
  { name: 'Test Tube (25 × 150 mm / Boiling Tube)', qty: '50', unit: 'pcs', category: 'Glassware', formula: 'Borosilicate', formulaPlain: 'Borosilicate', notes: 'Heavy wall boiling tubes 25 × 150 mm' },
  { name: 'Test Tubes Assorted', qty: '1', unit: 'set', category: 'Glassware', formula: 'Borosilicate', formulaPlain: 'Borosilicate', notes: 'Assorted qualitative laboratory test tubes' },
  { name: 'Test Tubes Small (8 × 75 mm) with Cap (12 × 75 mm)', qty: '58', unit: 'pcs', category: 'Glassware', formula: 'Borosilicate / PP Cap', formulaPlain: 'Borosilicate / PP', notes: 'Mini tubes with screw/plug caps' },
  { name: 'Thread Seal PTFE Tape', qty: '1', unit: 'roll', category: 'Equipment', formula: 'PTFE', formulaPlain: 'PTFE', notes: 'Polytetrafluoroethylene seal tape for gas and liquid tight fittings' },
  { name: 'Titanium Tetra Isopropoxide (50 mL)', qty: '1', unit: 'bottle (50 mL)', category: 'Chemical', formula: 'Ti[OCH(CH₃)₂]₄', formulaPlain: 'Ti[OCH(CH3)2]4', notes: 'TTIP titanium alkoxide precursor 50 mL' },
  { name: 'Titanium(IV) Isopropoxide (500 mL)', qty: '1', unit: 'bottle (500 mL)', category: 'Chemical', formula: 'Ti[OCH(CH₃)₂]₄', formulaPlain: 'Ti[OCH(CH3)2]4', notes: 'Titanium(IV) isopropoxide 500 mL' },
  { name: 'Transfer Pipettes / Plastic Droppers', qty: '1', unit: 'pack', category: 'Equipment', formula: 'LDPE Plastic', formulaPlain: 'LDPE', notes: 'Disposable transfer droppers' },
  { name: 'Volumetric Flask (10 mL)', qty: '9', unit: 'pcs', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', notes: 'Class A volumetric flasks 10 mL' },
  { name: 'Volumetric Flask (25 mL)', qty: '4', unit: 'pcs', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', notes: 'Class A volumetric flasks 25 mL' },
  { name: 'Volumetric Flask (5 mL)', qty: '7', unit: 'pcs', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', notes: 'Class A micro volumetric flasks 5 mL' },
  { name: 'Volumetric Flask (50 mL)', qty: '3', unit: 'pcs', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', notes: 'Class A volumetric flasks 50 mL' },
  { name: 'Volumetric Flask (500 mL)', qty: '1', unit: 'pc', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', notes: 'Class A volumetric flask 500 mL' },
  { name: 'Wash Bottle (Large LDPE)', qty: '3', unit: 'pcs', category: 'Equipment', formula: 'LDPE', formulaPlain: 'LDPE', notes: 'Squeeze wash bottles with integral delivery tube' },
  { name: 'Weighing Boats (Opened pack)', qty: '<500', unit: 'boats', category: 'Equipment', formula: 'Polystyrene', formulaPlain: 'PS', notes: 'Opened pack (<500 boats) - Anti-static pouring dishes' },
  { name: 'Weighing Boats (100 pieces pack Sealed)', qty: '1', unit: 'pack (100 pcs)', category: 'Equipment', formula: 'Polystyrene', formulaPlain: 'PS', notes: 'Sealed pack of 100 anti-static weighing boats' },
  { name: 'Zinc Acetate (500 g)', qty: '1', unit: 'bottle (500 g)', category: 'Chemical', formula: 'Zn(CH₃COO)₂·2H₂O', formulaPlain: 'Zn(CH3COO)2.2H2O', notes: 'Zinc acetate dihydrate 500 g' }
];

let nextItemNo = existingInventory.length + 1;
const combinedList = [...existingInventory];

function appendCupboardItems(list, locationName, cupboardPrefix) {
  list.forEach(item => {
    const itemNo = nextItemNo++;
    const plainSearch = [
      itemNo,
      item.name,
      item.category,
      item.formula,
      item.formulaPlain,
      item.qty,
      item.unit,
      locationName,
      cupboardPrefix,
      item.notes
    ].filter(Boolean).join(' ').toLowerCase();

    combinedList.push({
      id: `item-${itemNo}`,
      itemNo: itemNo,
      name: item.name,
      category: item.category,
      formula: item.formula || '',
      formulaPlain: item.formulaPlain || '',
      quantity: item.qty || '',
      unit: item.unit || '',
      location: locationName,
      block: locationName,
      grade: item.category === 'Chemical' ? 'AR / Laboratory Reagent' : (item.category === 'Glassware' ? 'Borosilicate 3.3 / Class A' : 'Standard Lab Grade'),
      notes: item.notes || '',
      searchText: plainSearch
    });
  });
}

appendCupboardItems(cupboard56Data, 'Cupboard 1 (56)', 'Cupboard 56');
appendCupboardItems(cupboard67Data, 'Cupboard 1 (67)', 'Cupboard 67');
appendCupboardItems(cupboard40Data, 'Cupboard 1 (40)', 'Cupboard 40');

console.log('Total combined database records:', combinedList.length);

// 3. Write JSON Files
fs.writeFileSync('data/inventory.json', JSON.stringify(combinedList, null, 2), 'utf8');
fs.writeFileSync('data/inventory.js', 'window.LAB_INVENTORY = ' + JSON.stringify(combinedList, null, 2) + ';\n', 'utf8');

if (fs.existsSync('public/data')) {
  fs.writeFileSync('public/data/inventory.json', JSON.stringify(combinedList, null, 2), 'utf8');
}

// 4. Generate CSV for full database and specific cupboards/categories
function generateCsv(items) {
  const headers = ['Item No', 'Item Name', 'Category', 'Formula', 'Plain Formula', 'Quantity', 'Unit', 'Location / Block', 'Grade', 'Notes'];
  const rows = items.map(i => [
    i.itemNo,
    `"${(i.name || '').replace(/"/g, '""')}"`,
    `"${(i.category || '').replace(/"/g, '""')}"`,
    `"${(i.formula || '').replace(/"/g, '""')}"`,
    `"${(i.formulaPlain || '').replace(/"/g, '""')}"`,
    `"${(i.quantity || '').replace(/"/g, '""')}"`,
    `"${(i.unit || '').replace(/"/g, '""')}"`,
    `"${(i.location || i.block || '').replace(/"/g, '""')}"`,
    `"${(i.grade || '').replace(/"/g, '""')}"`,
    `"${(i.notes || '').replace(/"/g, '""')}"`
  ]);
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
}

const fullCsv = generateCsv(combinedList);
fs.writeFileSync('data/inventory.csv', fullCsv, 'utf8');
fs.writeFileSync('data/full_lab_database.csv', fullCsv, 'utf8');

if (fs.existsSync('public/data')) {
  fs.writeFileSync('public/data/inventory.csv', fullCsv, 'utf8');
  fs.writeFileSync('public/data/full_lab_database.csv', fullCsv, 'utf8');
}

// Generate category specific CSVs
const chemicalsCsv = generateCsv(combinedList.filter(i => i.category === 'Chemical'));
const glasswareCsv = generateCsv(combinedList.filter(i => i.category === 'Glassware'));
const equipmentCsv = generateCsv(combinedList.filter(i => i.category === 'Equipment'));
const c40Csv = generateCsv(combinedList.filter(i => (i.location || i.block || '').includes('40')));
const c56Csv = generateCsv(combinedList.filter(i => (i.location || i.block || '').includes('56')));
const c67Csv = generateCsv(combinedList.filter(i => (i.location || i.block || '').includes('67')));

fs.writeFileSync('data/chemicals.csv', chemicalsCsv, 'utf8');
fs.writeFileSync('data/glassware.csv', glasswareCsv, 'utf8');
fs.writeFileSync('data/equipment.csv', equipmentCsv, 'utf8');
fs.writeFileSync('data/cupboard_40.csv', c40Csv, 'utf8');
fs.writeFileSync('data/cupboard_56.csv', c56Csv, 'utf8');
fs.writeFileSync('data/cupboard_67.csv', c67Csv, 'utf8');

if (fs.existsSync('public/data')) {
  fs.writeFileSync('public/data/chemicals.csv', chemicalsCsv, 'utf8');
  fs.writeFileSync('public/data/glassware.csv', glasswareCsv, 'utf8');
  fs.writeFileSync('public/data/equipment.csv', equipmentCsv, 'utf8');
  fs.writeFileSync('public/data/cupboard_40.csv', c40Csv, 'utf8');
  fs.writeFileSync('public/data/cupboard_56.csv', c56Csv, 'utf8');
  fs.writeFileSync('public/data/cupboard_67.csv', c67Csv, 'utf8');
}

// 5. Update src/data/inventoryData.ts
const tsContent = `import { InventoryItem } from '../types';

export const INITIAL_INVENTORY: InventoryItem[] = ${JSON.stringify(combinedList, null, 2)};
`;
fs.writeFileSync('src/data/inventoryData.ts', tsContent, 'utf8');

console.log('Successfully written complete database with', combinedList.length, 'records across all JSON, JS, TS and CSV files!');
