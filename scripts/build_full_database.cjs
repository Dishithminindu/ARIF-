const fs = require('fs');

// 1. Load the 112 verified chemicals from data/chemicals.json
const rawChemicals = JSON.parse(fs.readFileSync('data/chemicals.json', 'utf8'));

// 2. Glassware items (104 items, itemNo 113 - 216)
const rawGlassware = [
  // Beakers (Cupboard 54)
  { itemNo: 113, name: 'Beaker 50 mL Borosilicate', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '12', unit: 'pcs', location: 'Cupboard 1 (54)', block: 'Cupboard 1 (54)', grade: 'Borosilicate 3.3', notes: 'Graduated low form beaker with spout.' },
  { itemNo: 114, name: 'Beaker 100 mL Borosilicate', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '18', unit: 'pcs', location: 'Cupboard 1 (54)', block: 'Cupboard 1 (54)', grade: 'Borosilicate 3.3', notes: 'Graduated low form beaker with spout.' },
  { itemNo: 115, name: 'Beaker 250 mL Borosilicate', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '24', unit: 'pcs', location: 'Cupboard 1 (54)', block: 'Cupboard 1 (54)', grade: 'Borosilicate 3.3', notes: 'Graduated low form beaker with spout.' },
  { itemNo: 116, name: 'Beaker 500 mL Borosilicate', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '15', unit: 'pcs', location: 'Cupboard 1 (54)', block: 'Cupboard 1 (54)', grade: 'Borosilicate 3.3', notes: 'Graduated low form beaker with spout.' },
  { itemNo: 117, name: 'Beaker 1000 mL Borosilicate', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '8', unit: 'pcs', location: 'Cupboard 1 (54)', block: 'Cupboard 1 (54)', grade: 'Borosilicate 3.3', notes: 'Large capacity graduated beaker.' },
  { itemNo: 118, name: 'Beaker 2000 mL Borosilicate', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '4', unit: 'pcs', location: 'Cupboard 1 (54)', block: 'Cupboard 1 (54)', grade: 'Borosilicate 3.3', notes: 'Heavy duty tall form beaker.' },
  
  // Conical / Erlenmeyer Flasks (Cupboard 54)
  { itemNo: 119, name: 'Conical Flask 50 mL (Erlenmeyer)', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '10', unit: 'pcs', location: 'Cupboard 1 (54)', block: 'Cupboard 1 (54)', grade: 'Borosilicate 3.3', notes: 'Narrow neck titration flask.' },
  { itemNo: 120, name: 'Conical Flask 100 mL (Erlenmeyer)', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '16', unit: 'pcs', location: 'Cupboard 1 (54)', block: 'Cupboard 1 (54)', grade: 'Borosilicate 3.3', notes: 'Narrow neck titration flask.' },
  { itemNo: 121, name: 'Conical Flask 250 mL (Erlenmeyer)', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '20', unit: 'pcs', location: 'Cupboard 1 (54)', block: 'Cupboard 1 (54)', grade: 'Borosilicate 3.3', notes: 'Narrow neck titration flask, standard laboratory size.' },
  { itemNo: 122, name: 'Conical Flask 500 mL (Erlenmeyer)', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '12', unit: 'pcs', location: 'Cupboard 1 (54)', block: 'Cupboard 1 (54)', grade: 'Borosilicate 3.3', notes: 'Wide base titration flask.' },
  { itemNo: 123, name: 'Conical Flask 1000 mL (Erlenmeyer)', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '6', unit: 'pcs', location: 'Cupboard 1 (54)', block: 'Cupboard 1 (54)', grade: 'Borosilicate 3.3', notes: 'Narrow neck preparation flask.' },
  { itemNo: 124, name: 'Conical Flask 250 mL with Ground Joint (24/29)', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '8', unit: 'pcs', location: 'Cupboard 1 (54)', block: 'Cupboard 1 (54)', grade: 'Borosilicate 3.3', notes: 'Interchangeable standard taper joint socket.' },
  
  // Volumetric Flasks (Cupboard 54)
  { itemNo: 125, name: 'Volumetric Flask 10 mL Class A', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '6', unit: 'pcs', location: 'Cupboard 1 (54)', block: 'Cupboard 1 (54)', grade: 'Class A', notes: 'With PE stopper and batch calibration certificate.' },
  { itemNo: 126, name: 'Volumetric Flask 25 mL Class A', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '8', unit: 'pcs', location: 'Cupboard 1 (54)', block: 'Cupboard 1 (54)', grade: 'Class A', notes: 'With PE stopper, calibrated at 20°C.' },
  { itemNo: 127, name: 'Volumetric Flask 50 mL Class A', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '12', unit: 'pcs', location: 'Cupboard 1 (54)', block: 'Cupboard 1 (54)', grade: 'Class A', notes: 'High precision volumetric preparation standard.' },
  { itemNo: 128, name: 'Volumetric Flask 100 mL Class A', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '15', unit: 'pcs', location: 'Cupboard 1 (54)', block: 'Cupboard 1 (54)', grade: 'Class A', notes: 'Standard volumetric analysis flask with glass stopper.' },
  { itemNo: 129, name: 'Volumetric Flask 250 mL Class A', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '10', unit: 'pcs', location: 'Cupboard 1 (54)', block: 'Cupboard 1 (54)', grade: 'Class A', notes: 'Calibrated at 20°C with ground glass stopper.' },
  { itemNo: 130, name: 'Volumetric Flask 500 mL Class A', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '6', unit: 'pcs', location: 'Cupboard 1 (54)', block: 'Cupboard 1 (54)', grade: 'Class A', notes: 'High accuracy standard solution preparation.' },
  { itemNo: 131, name: 'Volumetric Flask 1000 mL Class A', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '4', unit: 'pcs', location: 'Cupboard 1 (54)', block: 'Cupboard 1 (54)', grade: 'Class A', notes: '1L volumetric calibration standard.' },
  { itemNo: 132, name: 'Amber Volumetric Flask 100 mL Class A', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '5', unit: 'pcs', location: 'Cupboard 1 (54)', block: 'Cupboard 1 (54)', grade: 'Class A Amber', notes: 'For light-sensitive reagents (AgNO3, etc.).' },

  // Measuring Cylinders (Cupboard 54)
  { itemNo: 133, name: 'Measuring Cylinder 10 mL Class B', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '8', unit: 'pcs', location: 'Cupboard 1 (54)', block: 'Cupboard 1 (54)', grade: 'Borosilicate 3.3', notes: 'Hexagonal glass base with spout.' },
  { itemNo: 134, name: 'Measuring Cylinder 25 mL Class B', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '10', unit: 'pcs', location: 'Cupboard 1 (54)', block: 'Cupboard 1 (54)', grade: 'Borosilicate 3.3', notes: 'Hexagonal glass base with graduation markings.' },
  { itemNo: 135, name: 'Measuring Cylinder 50 mL Class B', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '12', unit: 'pcs', location: 'Cupboard 1 (54)', block: 'Cupboard 1 (54)', grade: 'Borosilicate 3.3', notes: 'Graduated measuring cylinder with pouring spout.' },
  { itemNo: 136, name: 'Measuring Cylinder 100 mL Class A', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '10', unit: 'pcs', location: 'Cupboard 1 (54)', block: 'Cupboard 1 (54)', grade: 'Class A', notes: 'Precision graduated cylinder with calibration marks.' },
  { itemNo: 137, name: 'Measuring Cylinder 250 mL Class B', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '6', unit: 'pcs', location: 'Cupboard 1 (54)', block: 'Cupboard 1 (54)', grade: 'Borosilicate 3.3', notes: 'Hexagonal base with bumper guard ring.' },
  { itemNo: 138, name: 'Measuring Cylinder 500 mL Class B', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '4', unit: 'pcs', location: 'Cupboard 1 (54)', block: 'Cupboard 1 (54)', grade: 'Borosilicate 3.3', notes: 'Large capacity measuring cylinder.' },
  { itemNo: 139, name: 'Measuring Cylinder 1000 mL Class B', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '3', unit: 'pcs', location: 'Cupboard 1 (54)', block: 'Cupboard 1 (54)', grade: 'Borosilicate 3.3', notes: '1 Litre tall graduated cylinder.' },

  // Pipettes & Burettes (Cupboard 54)
  { itemNo: 140, name: 'Volumetric Pipette 1 mL Class A', category: 'Glassware', formula: 'Glass', formulaPlain: 'Glass', quantity: '6', unit: 'pcs', location: 'Cupboard 1 (54)', block: 'Cupboard 1 (54)', grade: 'Class A', notes: 'One mark bulb pipette.' },
  { itemNo: 141, name: 'Volumetric Pipette 2 mL Class A', category: 'Glassware', formula: 'Glass', formulaPlain: 'Glass', quantity: '6', unit: 'pcs', location: 'Cupboard 1 (54)', block: 'Cupboard 1 (54)', grade: 'Class A', notes: 'One mark bulb pipette.' },
  { itemNo: 142, name: 'Volumetric Pipette 5 mL Class A', category: 'Glassware', formula: 'Glass', formulaPlain: 'Glass', quantity: '10', unit: 'pcs', location: 'Cupboard 1 (54)', block: 'Cupboard 1 (54)', grade: 'Class A', notes: 'Single volume transfer pipette.' },
  { itemNo: 143, name: 'Volumetric Pipette 10 mL Class A', category: 'Glassware', formula: 'Glass', formulaPlain: 'Glass', quantity: '12', unit: 'pcs', location: 'Cupboard 1 (54)', block: 'Cupboard 1 (54)', grade: 'Class A', notes: 'Single volume transfer pipette.' },
  { itemNo: 144, name: 'Volumetric Pipette 20 mL Class A', category: 'Glassware', formula: 'Glass', formulaPlain: 'Glass', quantity: '6', unit: 'pcs', location: 'Cupboard 1 (54)', block: 'Cupboard 1 (54)', grade: 'Class A', notes: 'Single volume bulb pipette.' },
  { itemNo: 145, name: 'Volumetric Pipette 25 mL Class A', category: 'Glassware', formula: 'Glass', formulaPlain: 'Glass', quantity: '10', unit: 'pcs', location: 'Cupboard 1 (54)', block: 'Cupboard 1 (54)', grade: 'Class A', notes: 'Standard volumetric transfer pipette.' },
  { itemNo: 146, name: 'Graduated Measuring Pipette 1 mL (0.01 mL div)', category: 'Glassware', formula: 'Glass', formulaPlain: 'Glass', quantity: '8', unit: 'pcs', location: 'Cupboard 1 (54)', block: 'Cupboard 1 (54)', grade: 'Class AS', notes: 'Serological type Mohr pipette.' },
  { itemNo: 147, name: 'Graduated Measuring Pipette 5 mL (0.05 mL div)', category: 'Glassware', formula: 'Glass', formulaPlain: 'Glass', quantity: '10', unit: 'pcs', location: 'Cupboard 1 (54)', block: 'Cupboard 1 (54)', grade: 'Class AS', notes: 'Graduated measuring pipette.' },
  { itemNo: 148, name: 'Graduated Measuring Pipette 10 mL (0.1 mL div)', category: 'Glassware', formula: 'Glass', formulaPlain: 'Glass', quantity: '12', unit: 'pcs', location: 'Cupboard 1 (54)', block: 'Cupboard 1 (54)', grade: 'Class AS', notes: 'Graduated measuring pipette.' },
  { itemNo: 149, name: 'Burette 25 mL with PTFE Stopcock Class A', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '8', unit: 'pcs', location: 'Cupboard 1 (54)', block: 'Cupboard 1 (54)', grade: 'Class A PTFE', notes: 'Zero-grease PTFE key stopcock for titrations.' },
  { itemNo: 150, name: 'Burette 50 mL with PTFE Stopcock Class A', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '14', unit: 'pcs', location: 'Cupboard 1 (54)', block: 'Cupboard 1 (54)', grade: 'Class A PTFE', notes: 'Precision titration burette with Schellbach stripe.' },
  { itemNo: 151, name: 'Amber Burette 50 mL with PTFE Stopcock', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '4', unit: 'pcs', location: 'Cupboard 1 (54)', block: 'Cupboard 1 (54)', grade: 'Class A Amber', notes: 'For light-sensitive titrations (permanganate/iodine).' },

  // Separating Funnels & Funnels (Cupboard 56)
  { itemNo: 152, name: 'Separating Funnel 100 mL (Conical with PTFE Key)', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '5', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Borosilicate 3.3', notes: 'Pear-shaped with interchangeable stopper.' },
  { itemNo: 153, name: 'Separating Funnel 250 mL (Pear Shaped)', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '8', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Borosilicate 3.3', notes: 'With PTFE stopcock and 19/26 stopper.' },
  { itemNo: 154, name: 'Separating Funnel 500 mL (Pear Shaped)', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '6', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Borosilicate 3.3', notes: 'Liquid-liquid extraction funnel.' },
  { itemNo: 155, name: 'Separating Funnel 1000 mL (Cylindrical)', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '3', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Borosilicate 3.3', notes: 'High volume extraction vessel.' },
  { itemNo: 156, name: 'Glass Filter Funnel 50 mm Diameter (Short Stem)', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '10', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Borosilicate 3.3', notes: '60 degree angle conical filtration funnel.' },
  { itemNo: 157, name: 'Glass Filter Funnel 75 mm Diameter (Long Stem)', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '8', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Borosilicate 3.3', notes: 'Long stem for rapid gravity filtration.' },
  { itemNo: 158, name: 'Glass Filter Funnel 100 mm Diameter', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '6', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Borosilicate 3.3', notes: 'Heavy duty large filtration funnel.' },
  { itemNo: 159, name: 'Hirsch Funnel (Porcelain / Glass Sintered G3)', category: 'Glassware', formula: 'Porcelain/Glass', formulaPlain: 'Porcelain/Glass', quantity: '4', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Sintered Disc', notes: 'Microscale vacuum filtration funnel.' },
  { itemNo: 160, name: 'Büchner Funnel 90 mm (Porcelain)', category: 'Glassware', formula: 'Porcelain', formulaPlain: 'Porcelain', quantity: '5', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Glazed Porcelain', notes: 'Standard vacuum filtration funnel.' },
  { itemNo: 161, name: 'Büchner Funnel 120 mm (Porcelain)', category: 'Glassware', formula: 'Porcelain', formulaPlain: 'Porcelain', quantity: '4', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Glazed Porcelain', notes: 'Large diameter vacuum filtration funnel.' },
  { itemNo: 162, name: 'Büchner Vacuum Flask 250 mL (Filter Flask)', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '4', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Heavy Wall', notes: 'With side tubulation for vacuum hose.' },
  { itemNo: 163, name: 'Büchner Vacuum Flask 500 mL (Filter Flask)', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '6', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Heavy Wall', notes: 'Heavy wall glass flask with side hose barb.' },
  { itemNo: 164, name: 'Büchner Vacuum Flask 1000 mL (Filter Flask)', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '4', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Heavy Wall', notes: '1L thick wall vacuum filtering flask.' },

  // Condensers & Distillation (Cupboard 56)
  { itemNo: 165, name: 'Liebig Condenser 200 mm (Joint 24/29)', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '6', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Borosilicate 3.3', notes: 'Straight inner tube water-cooled condenser.' },
  { itemNo: 166, name: 'Liebig Condenser 300 mm (Joint 24/29)', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '8', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Borosilicate 3.3', notes: 'Standard distillation condenser.' },
  { itemNo: 167, name: 'Graham Condenser (Coiled Tube) 300 mm', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '4', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Borosilicate 3.3', notes: 'Spiral inner coil condenser for high efficiency cooling.' },
  { itemNo: 168, name: 'Allihn Condenser (Bulb Reflux) 300 mm', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '6', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Borosilicate 3.3', notes: 'Spherical bulbs inside jacket for vertical reflux synthesis.' },
  { itemNo: 169, name: 'Dimroth Condenser 300 mm', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '3', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Borosilicate 3.3', notes: 'Internal cooling coil with vapor jacket.' },
  { itemNo: 170, name: 'Round Bottom Flask 100 mL (Single Neck 24/29)', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '8', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Borosilicate 3.3', notes: 'Spherical distillation / boiling flask.' },
  { itemNo: 171, name: 'Round Bottom Flask 250 mL (Single Neck 24/29)', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '10', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Borosilicate 3.3', notes: 'Standard organic synthesis reaction flask.' },
  { itemNo: 172, name: 'Round Bottom Flask 500 mL (Single Neck 24/29)', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '6', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Borosilicate 3.3', notes: 'Large boiling flask.' },
  { itemNo: 173, name: 'Round Bottom Flask 250 mL (Two Neck 24/29 + 14/23)', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '4', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Borosilicate 3.3', notes: 'Two neck reaction vessel for inert gas / thermometer.' },
  { itemNo: 174, name: 'Round Bottom Flask 500 mL (Three Neck 24/29)', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '3', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Borosilicate 3.3', notes: 'Three neck flask for complex reaction setups.' },
  { itemNo: 175, name: 'Distillation Head / Claisen Adapter (24/29)', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '4', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Borosilicate 3.3', notes: 'Multi-way adapter for distillation apparatus.' },
  { itemNo: 176, name: 'Vacuum Receiver Adapter / Pig Adapter (24/29)', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '3', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Borosilicate 3.3', notes: 'With vacuum takeoff adapter.' },
  { itemNo: 177, name: 'Thermometer Pocket Adapter (Joint 14/23)', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '6', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Borosilicate 3.3', notes: 'Ground joint thermometer holder with screw cap.' },
  { itemNo: 178, name: 'Soxhlet Extraction Apparatus 250 mL', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '2', unit: 'sets', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Complete Set', notes: 'Extractor body, Allihn condenser, and 500mL flat bottom flask.' },
  { itemNo: 179, name: 'Dean-Stark Trap 10 mL (with Stopcock)', category: 'Glassware', formula: 'SiO₂·B₂O₃', formulaPlain: 'SiO2.B2O3', quantity: '2', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Borosilicate 3.3', notes: 'Azeotropic water separator with PTFE key.' },

  // Test Tubes, Watch Glasses, Weighing Bottles, Petri Dishes (Cupboard 56)
  { itemNo: 180, name: 'Test Tubes 15 x 125 mm (Rimmed)', category: 'Glassware', formula: 'Borosilicate', formulaPlain: 'Borosilicate', quantity: '100', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Borosilicate Glass', notes: 'Standard qualitative reaction tubes.' },
  { itemNo: 181, name: 'Test Tubes 18 x 150 mm (Medium)', category: 'Glassware', formula: 'Borosilicate', formulaPlain: 'Borosilicate', quantity: '80', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Borosilicate Glass', notes: 'Medium laboratory test tubes.' },
  { itemNo: 182, name: 'Boiling Tubes 25 x 150 mm (Heavy Wall)', category: 'Glassware', formula: 'Borosilicate', formulaPlain: 'Borosilicate', quantity: '40', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Heavy Duty', notes: 'Wide diameter tubes for direct flame heating.' },
  { itemNo: 183, name: 'Centrifuge Tubes 15 mL Conical Glass', category: 'Glassware', formula: 'Borosilicate', formulaPlain: 'Borosilicate', quantity: '24', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Graduated', notes: 'Conical bottom graduated centrifuge tubes.' },
  { itemNo: 184, name: 'Nessler Cylinders 50 mL Matched Pair', category: 'Glassware', formula: 'Glass', formulaPlain: 'Glass', quantity: '6', unit: 'pairs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Matched Optic', notes: 'Flat optical bottom color comparison tubes.' },
  { itemNo: 185, name: 'Nessler Cylinders 100 mL Matched Pair', category: 'Glassware', formula: 'Glass', formulaPlain: 'Glass', quantity: '4', unit: 'pairs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Matched Optic', notes: 'Colorimetric comparison standard tubes.' },
  { itemNo: 186, name: 'Watch Glass 50 mm Diameter', category: 'Glassware', formula: 'Soda Glass', formulaPlain: 'Soda Glass', quantity: '15', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Polished Edges', notes: 'Beaker cover and small sample evaporation dish.' },
  { itemNo: 187, name: 'Watch Glass 75 mm Diameter', category: 'Glassware', formula: 'Soda Glass', formulaPlain: 'Soda Glass', quantity: '20', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Polished Edges', notes: 'Standard watch glass dish.' },
  { itemNo: 188, name: 'Watch Glass 100 mm Diameter', category: 'Glassware', formula: 'Soda Glass', formulaPlain: 'Soda Glass', quantity: '15', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Polished Edges', notes: 'Large watch glass dish.' },
  { itemNo: 189, name: 'Watch Glass 150 mm Diameter', category: 'Glassware', formula: 'Soda Glass', formulaPlain: 'Soda Glass', quantity: '8', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Polished Edges', notes: 'Wide coverage dish.' },
  { itemNo: 190, name: 'Petri Dishes 90 mm Glass (Pairs with Lids)', category: 'Glassware', formula: 'Borosilicate', formulaPlain: 'Borosilicate', quantity: '25', unit: 'pairs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Autoclavable', notes: 'Reusable borosilicate culture dishes.' },
  { itemNo: 191, name: 'Petri Dishes 60 mm Glass (Pairs with Lids)', category: 'Glassware', formula: 'Borosilicate', formulaPlain: 'Borosilicate', quantity: '15', unit: 'pairs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Autoclavable', notes: 'Small culture and crystal growth dishes.' },
  { itemNo: 192, name: 'Glass Weighing Bottle 25 x 40 mm (Ground Stopper)', category: 'Glassware', formula: 'Borosilicate', formulaPlain: 'Borosilicate', quantity: '10', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Analytical', notes: 'Low form weighing bottle with ground-in lid.' },
  { itemNo: 193, name: 'Glass Weighing Bottle 40 x 70 mm (Tall Form)', category: 'Glassware', formula: 'Borosilicate', formulaPlain: 'Borosilicate', quantity: '8', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Analytical', notes: 'Tall form for moisture-sensitive analytical samples.' },
  { itemNo: 194, name: 'Crystallizing Dish 100 mm (Flat Bottom with Spout)', category: 'Glassware', formula: 'Borosilicate', formulaPlain: 'Borosilicate', quantity: '6', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Borosilicate 3.3', notes: 'Heavy wall flat bottom dish for recrystallization.' },
  { itemNo: 195, name: 'Crystallizing Dish 150 mm', category: 'Glassware', formula: 'Borosilicate', formulaPlain: 'Borosilicate', quantity: '4', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Borosilicate 3.3', notes: 'Large diameter crystallization basin.' },
  { itemNo: 196, name: 'Evaporating Basin 75 mm (Porcelain)', category: 'Glassware', formula: 'Porcelain', formulaPlain: 'Porcelain', quantity: '10', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Glazed Inside', notes: 'With lip spout, thermal shock resistant.' },
  { itemNo: 197, name: 'Evaporating Basin 100 mm (Porcelain)', category: 'Glassware', formula: 'Porcelain', formulaPlain: 'Porcelain', quantity: '8', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Glazed Inside', notes: 'Evaporation and drying dish.' },
  { itemNo: 198, name: 'Crucible with Lid 30 mL (Porcelain)', category: 'Glassware', formula: 'Porcelain', formulaPlain: 'Porcelain', quantity: '12', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'High Temp 1150°C', notes: 'For high-temperature gravimetric ashing.' },
  { itemNo: 199, name: 'Crucible with Lid 50 mL (Porcelain)', category: 'Glassware', formula: 'Porcelain', formulaPlain: 'Porcelain', quantity: '8', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'High Temp 1150°C', notes: 'Medium size ashing crucible.' },
  { itemNo: 200, name: 'Gooch Crucible with Perforated Bottom 30 mL', category: 'Glassware', formula: 'Porcelain', formulaPlain: 'Porcelain', quantity: '6', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Analytical', notes: 'For filtering gravimetric precipitates.' },
  { itemNo: 201, name: 'Mortar and Pestle 100 mm (Porcelain)', category: 'Glassware', formula: 'Porcelain', formulaPlain: 'Porcelain', quantity: '6', unit: 'sets', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Unglazed Grinding Surface', notes: 'Heavy duty solid porcelain mortar with pour spout.' },
  { itemNo: 202, name: 'Mortar and Pestle 130 mm (Agate)', category: 'Glassware', formula: 'SiO₂ (Agate)', formulaPlain: 'SiO2 (Agate)', quantity: '1', unit: 'set', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Ultra-Pure Agate', notes: 'High purity contamination-free solid agate mortar.' },
  { itemNo: 203, name: 'Glass Desiccator 200 mm Diameter (Plain)', category: 'Glassware', formula: 'Soda-Lime Glass', formulaPlain: 'Soda-Lime Glass', quantity: '2', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Heavy Glass', notes: 'With porcelain perforated plate and knob lid.' },
  { itemNo: 204, name: 'Vacuum Glass Desiccator 250 mm (with Stopcock Lid)', category: 'Glassware', formula: 'Borosilicate', formulaPlain: 'Borosilicate', quantity: '2', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Vacuum Rated', notes: 'Vacuum desiccator with ground stopcock and porcelain plate.' },
  { itemNo: 205, name: 'Glass Stirring Rods 200 mm x 6 mm', category: 'Glassware', formula: 'Glass', formulaPlain: 'Glass', quantity: '30', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Rounded Ends', notes: 'Fire polished smooth rounded ends.' },
  { itemNo: 206, name: 'Glass Stirring Rod with Rubber Policeman', category: 'Glassware', formula: 'Glass/Rubber', formulaPlain: 'Glass/Rubber', quantity: '10', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Analytical', notes: 'Rubber tip for quantitative precipitate scraping.' },
  { itemNo: 207, name: 'Pasteur Pipettes Glass 150 mm (Uncalibrated)', category: 'Glassware', formula: 'Soda Glass', formulaPlain: 'Soda Glass', quantity: '200', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Disposable/Reusable', notes: 'Short form disposable transfer pipettes.' },
  { itemNo: 208, name: 'Pasteur Pipettes Glass 230 mm (Long Form)', category: 'Glassware', formula: 'Soda Glass', formulaPlain: 'Soda Glass', quantity: '150', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Disposable/Reusable', notes: 'Long tip capillary pipettes.' },
  { itemNo: 209, name: 'Reagent Bottle 125 mL Clear (Screw Cap GL45)', category: 'Glassware', formula: 'Borosilicate', formulaPlain: 'Borosilicate', quantity: '15', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'ISO-GL45', notes: 'Autoclavable PP cap and pouring ring.' },
  { itemNo: 210, name: 'Reagent Bottle 250 mL Clear (Screw Cap GL45)', category: 'Glassware', formula: 'Borosilicate', formulaPlain: 'Borosilicate', quantity: '20', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'ISO-GL45', notes: 'Graduated media storage bottle.' },
  { itemNo: 211, name: 'Reagent Bottle 500 mL Clear (Screw Cap GL45)', category: 'Glassware', formula: 'Borosilicate', formulaPlain: 'Borosilicate', quantity: '15', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'ISO-GL45', notes: 'Graduated media storage bottle.' },
  { itemNo: 212, name: 'Reagent Bottle 1000 mL Clear (Screw Cap GL45)', category: 'Glassware', formula: 'Borosilicate', formulaPlain: 'Borosilicate', quantity: '8', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'ISO-GL45', notes: '1L laboratory reagent bottle.' },
  { itemNo: 213, name: 'Amber Reagent Bottle 250 mL (Screw Cap GL45)', category: 'Glassware', formula: 'Borosilicate', formulaPlain: 'Borosilicate', quantity: '12', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Amber ISO-GL45', notes: 'UV protection for light-sensitive solutions.' },
  { itemNo: 214, name: 'Amber Reagent Bottle 500 mL (Screw Cap GL45)', category: 'Glassware', formula: 'Borosilicate', formulaPlain: 'Borosilicate', quantity: '10', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Amber ISO-GL45', notes: 'UV protection for light-sensitive solutions.' },
  { itemNo: 215, name: 'Dropping Bottle 60 mL with Ground Glass Pipette', category: 'Glassware', formula: 'Soda Glass', formulaPlain: 'Soda Glass', quantity: '12', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Amber Glass', notes: 'With rubber teat and ground dropper.' },
  { itemNo: 216, name: 'Gas Washing Bottle / Dreschel Bottle 250 mL', category: 'Glassware', formula: 'Borosilicate', formulaPlain: 'Borosilicate', quantity: '4', unit: 'pcs', location: 'Cupboard 1 (56)', block: 'Cupboard 1 (56)', grade: 'Borosilicate 3.3', notes: 'For scrubbing and bubbling gases through liquids.' }
];

// 3. Equipment & Apparatus items (85 items, itemNo 217 - 301)
const rawEquipment = [
  // Analytical Instruments (Cupboard 40)
  { itemNo: 217, name: 'Digital Analytical Balance (0.0001 g / 220 g)', category: 'Equipment', formula: 'Electronic', formulaPlain: 'Electronic', quantity: '2', unit: 'units', location: 'Cupboard 1 (40)', block: 'Cupboard 1 (40)', grade: 'Analytical 4-Decimal', notes: 'Internal calibration, draft shield, 0.1 mg readability.' },
  { itemNo: 218, name: 'Precision Top Loading Balance (0.01 g / 1200 g)', category: 'Equipment', formula: 'Electronic', formulaPlain: 'Electronic', quantity: '3', unit: 'units', location: 'Cupboard 1 (40)', block: 'Cupboard 1 (40)', grade: 'Precision 2-Decimal', notes: 'Dual range top pan digital balance.' },
  { itemNo: 219, name: 'Digital Benchtop pH Meter with Glass Electrode', category: 'Equipment', formula: 'Electronic', formulaPlain: 'Electronic', quantity: '3', unit: 'units', location: 'Cupboard 1 (40)', block: 'Cupboard 1 (40)', grade: 'pH/mV/Temp', notes: 'Automatic temperature compensation (ATC), 3-point calibration.' },
  { itemNo: 220, name: 'Portable Handheld pH Meter (Waterproof IP67)', category: 'Equipment', formula: 'Electronic', formulaPlain: 'Electronic', quantity: '2', unit: 'units', location: 'Cupboard 1 (40)', block: 'Cupboard 1 (40)', grade: 'Field Portable', notes: 'Battery powered with gel combination electrode.' },
  { itemNo: 221, name: 'Digital Conductivity / TDS Meter', category: 'Equipment', formula: 'Electronic', formulaPlain: 'Electronic', quantity: '2', unit: 'units', location: 'Cupboard 1 (40)', block: 'Cupboard 1 (40)', grade: 'Conductivity/TDS', notes: 'Range: 0.01 µS/cm to 200.0 mS/cm with platinum cell.' },
  { itemNo: 222, name: 'UV-Visible Spectrophotometer (Single Beam 190–1100 nm)', category: 'Equipment', formula: 'Optical/Electronic', formulaPlain: 'Optical/Electronic', quantity: '1', unit: 'unit', location: 'Cupboard 1 (40)', block: 'Cupboard 1 (40)', grade: 'Spectroscopic', notes: 'Digital display, 4-cell holder with 10mm quartz cuvettes.' },
  { itemNo: 223, name: 'Visible Spectrophotometer / Colorimeter (340–1000 nm)', category: 'Equipment', formula: 'Optical/Electronic', formulaPlain: 'Optical/Electronic', quantity: '2', unit: 'units', location: 'Cupboard 1 (40)', block: 'Cupboard 1 (40)', grade: 'Colorimetric', notes: 'Microprocessor based filter colorimeter.' },
  { itemNo: 224, name: 'Quartz Cuvettes 10 mm Pathlength (Matched Pair)', category: 'Equipment', formula: 'Fused Quartz', formulaPlain: 'Fused Quartz', quantity: '4', unit: 'pairs', location: 'Cupboard 1 (40)', block: 'Cupboard 1 (40)', grade: 'UV-Grade Quartz', notes: 'Transmission: 190–2500 nm, 3.5 mL volume.' },
  { itemNo: 225, name: 'Optical Glass Cuvettes 10 mm Pathlength (Matched Pair)', category: 'Equipment', formula: 'Optical Glass', formulaPlain: 'Optical Glass', quantity: '6', unit: 'pairs', location: 'Cupboard 1 (40)', block: 'Cupboard 1 (40)', grade: 'Visible Range', notes: 'Transmission: 320–2500 nm.' },
  { itemNo: 226, name: 'Digital Melting Point Apparatus (Up to 300°C)', category: 'Equipment', formula: 'Electronic', formulaPlain: 'Electronic', quantity: '2', unit: 'units', location: 'Cupboard 1 (40)', block: 'Cupboard 1 (40)', grade: 'Capillary Method', notes: 'Digital temperature sensor, illuminated viewing magnifier.' },
  { itemNo: 227, name: 'Abbe Refractometer (nD 1.3000 to 1.7000 / Brix 0–95%)', category: 'Equipment', formula: 'Optical', formulaPlain: 'Optical', quantity: '1', unit: 'unit', location: 'Cupboard 1 (40)', block: 'Cupboard 1 (40)', grade: 'Precision Optical', notes: 'With built-in temperature jacket and calibration test piece.' },
  { itemNo: 228, name: 'Polarimeter (Manual Disc / Sodium Lamp 589 nm)', category: 'Equipment', formula: 'Optical', formulaPlain: 'Optical', quantity: '1', unit: 'unit', location: 'Cupboard 1 (40)', block: 'Cupboard 1 (40)', grade: 'Optical Rotation', notes: 'Vernier scale 0.05°, with 100mm and 200mm observation tubes.' },

  // Heating & Stirring Equipment (Cupboard 55 / 67)
  { itemNo: 229, name: 'Magnetic Stirrer with Ceramic Hot Plate (380°C / 1500 RPM)', category: 'Equipment', formula: 'Electronic', formulaPlain: 'Electronic', quantity: '4', unit: 'units', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Digital Controlled', notes: 'White ceramic top plate with PT1000 temperature probe.' },
  { itemNo: 230, name: 'Compact Magnetic Stirrer (Non-Heating 2000 RPM)', category: 'Equipment', formula: 'Electronic', formulaPlain: 'Electronic', quantity: '3', unit: 'units', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Variable Speed', notes: 'Stepless speed control up to 3 Litres capacity.' },
  { itemNo: 231, name: 'Vortex Mixer (Touch / Continuous Mode 3000 RPM)', category: 'Equipment', formula: 'Electromechanical', formulaPlain: 'Electromechanical', quantity: '3', unit: 'units', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Heavy Duty', notes: 'Rubber cup head and universal platform attachment.' },
  { itemNo: 232, name: 'Ultrasonic Bath / Sonicator 3 Litres (with Heater & Timer)', category: 'Equipment', formula: 'Electromechanical', formulaPlain: 'Electromechanical', quantity: '1', unit: 'unit', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: '40 kHz Ultrasound', notes: 'Stainless steel tank, degas function and basket.' },
  { itemNo: 233, name: 'Benchtop Centrifuge 8 x 15 mL (4000 RPM / 2147 x g)', category: 'Equipment', formula: 'Electromechanical', formulaPlain: 'Electromechanical', quantity: '2', unit: 'units', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Fixed Angle Rotor', notes: 'Digital timer, safety lid interlock, 8-tube angle rotor.' },
  { itemNo: 234, name: 'Micro-Centrifuge 12 x 1.5/2.0 mL (13,500 RPM)', category: 'Equipment', formula: 'Electromechanical', formulaPlain: 'Electromechanical', quantity: '1', unit: 'unit', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'High Speed Micro', notes: 'Pulse button for quick spin, brushless motor.' },
  { itemNo: 235, name: 'Heating Mantle 250 mL (with Built-in Controller)', category: 'Equipment', formula: 'Electric', formulaPlain: 'Electric', quantity: '3', unit: 'units', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Knitted Glass Fabric', notes: 'Thermal insulation, up to 450°C surface temperature.' },
  { itemNo: 236, name: 'Heating Mantle 500 mL (with Built-in Controller)', category: 'Equipment', formula: 'Electric', formulaPlain: 'Electric', quantity: '3', unit: 'units', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Knitted Glass Fabric', notes: 'Even hemispherical heating for round bottom flasks.' },
  { itemNo: 237, name: 'Heating Mantle 1000 mL (with Built-in Controller)', category: 'Equipment', formula: 'Electric', formulaPlain: 'Electric', quantity: '2', unit: 'units', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Knitted Glass Fabric', notes: '1L capacity mantle heater.' },
  { itemNo: 238, name: 'Thermostatic Water Bath 6 Litres (Ambient to 100°C)', category: 'Equipment', formula: 'Electric', formulaPlain: 'Electric', quantity: '2', unit: 'units', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Stainless Steel', notes: 'Digital PID controller with concentric ring lid.' },
  { itemNo: 239, name: 'Laboratory Drying Oven (Ambient +5°C to 250°C / 30L)', category: 'Equipment', formula: 'Electric', formulaPlain: 'Electric', quantity: '1', unit: 'unit', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Forced Air Convection', notes: 'Stainless interior with two perforated shelves.' },
  { itemNo: 240, name: 'Muffle Furnace (Up to 1100°C / Ceramic Chamber)', category: 'Equipment', formula: 'Electric', formulaPlain: 'Electric', quantity: '1', unit: 'unit', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'High Temp Ashing', notes: 'Microprocessor programmer with thermocouple sensor.' },
  { itemNo: 241, name: 'Oil-Free Diaphragm Vacuum Pump (25 L/min / 100 mbar)', category: 'Equipment', formula: 'Electromechanical', formulaPlain: 'Electromechanical', quantity: '2', unit: 'units', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'PTFE Coated', notes: 'Chemical resistant diaphragm for vacuum filtration and rotary evaporators.' },
  { itemNo: 242, name: 'Water Jet Aspirator Vacuum Pump (Polypropylene)', category: 'Equipment', formula: 'Polypropylene', formulaPlain: 'Polypropylene', quantity: '6', unit: 'pcs', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Corrosion Free', notes: 'With non-return check valve, connects to lab faucet.' },
  { itemNo: 243, name: 'UV Inspection Lamp (Dual Wavelength 254 nm / 365 nm)', category: 'Equipment', formula: 'Electronic', formulaPlain: 'Electronic', quantity: '2', unit: 'units', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Short/Long UV', notes: 'For TLC plate visualization and fluorescent analysis.' },

  // Pipetting & Liquid Handling (Cupboard 67)
  { itemNo: 244, name: 'Micropipette 0.5–10 µL Single Channel (Variable)', category: 'Equipment', formula: 'Mechanical', formulaPlain: 'Mechanical', quantity: '2', unit: 'pcs', location: 'Cupboard 1 (67)', block: 'Cupboard 1 (67)', grade: 'Autoclavable', notes: 'Precision micro volume pipettor with volume lock.' },
  { itemNo: 245, name: 'Micropipette 2–20 µL Single Channel (Variable)', category: 'Equipment', formula: 'Mechanical', formulaPlain: 'Mechanical', quantity: '3', unit: 'pcs', location: 'Cupboard 1 (67)', block: 'Cupboard 1 (67)', grade: 'Autoclavable', notes: 'Universal tip fitting, ergonomic finger rest.' },
  { itemNo: 246, name: 'Micropipette 20–200 µL Single Channel (Variable)', category: 'Equipment', formula: 'Mechanical', formulaPlain: 'Mechanical', quantity: '4', unit: 'pcs', location: 'Cupboard 1 (67)', block: 'Cupboard 1 (67)', grade: 'Autoclavable', notes: 'Standard laboratory volume pipettor.' },
  { itemNo: 247, name: 'Micropipette 100–1000 µL Single Channel (Variable)', category: 'Equipment', formula: 'Mechanical', formulaPlain: 'Mechanical', quantity: '4', unit: 'pcs', location: 'Cupboard 1 (67)', block: 'Cupboard 1 (67)', grade: 'Autoclavable', notes: 'High precision 1mL adjustable micropipette.' },
  { itemNo: 248, name: 'Micropipette 1–5 mL Macro Volume Pipettor', category: 'Equipment', formula: 'Mechanical', formulaPlain: 'Mechanical', quantity: '2', unit: 'pcs', location: 'Cupboard 1 (67)', block: 'Cupboard 1 (67)', grade: 'Macro Pipette', notes: 'Includes macro tip adapters.' },
  { itemNo: 249, name: 'Electronic Motorized Pipette Filler (0.1–100 mL)', category: 'Equipment', formula: 'Battery Powered', formulaPlain: 'Battery Powered', quantity: '2', unit: 'units', location: 'Cupboard 1 (67)', block: 'Cupboard 1 (67)', grade: 'Rechargeable Li-Ion', notes: 'Speed control trigger with 0.45 µm membrane filter.' },
  { itemNo: 250, name: 'Rubber 3-Way Pipette Bulb (Standard Red)', category: 'Equipment', formula: 'Natural Rubber', formulaPlain: 'Natural Rubber', quantity: '10', unit: 'pcs', location: 'Cupboard 1 (67)', block: 'Cupboard 1 (67)', grade: 'Safety Suction Bulb', notes: 'Three glass ball valves for aspirate, dispense, and drain.' },
  { itemNo: 251, name: 'Pipette Pump / Pi-Pump 10 mL (Green)', category: 'Equipment', formula: 'Plastic', formulaPlain: 'Plastic', quantity: '8', unit: 'pcs', location: 'Cupboard 1 (67)', block: 'Cupboard 1 (67)', grade: 'Thumbwheel Control', notes: 'Rapid release lever with knurled thumbwheel.' },
  { itemNo: 252, name: 'Pipette Pump / Pi-Pump 25 mL (Red)', category: 'Equipment', formula: 'Plastic', formulaPlain: 'Plastic', quantity: '8', unit: 'pcs', location: 'Cupboard 1 (67)', block: 'Cupboard 1 (67)', grade: 'Thumbwheel Control', notes: 'Thumbwheel aspirator for large volume serological pipettes.' },
  { itemNo: 253, name: 'Micropipette Tips 10 µL White (Rack of 96)', category: 'Equipment', formula: 'PP (Polypropylene)', formulaPlain: 'PP (Polypropylene)', quantity: '10', unit: 'racks', location: 'Cupboard 1 (67)', block: 'Cupboard 1 (67)', grade: 'DNase/RNase Free', notes: 'Autoclavable micro tips in hinged rack.' },
  { itemNo: 254, name: 'Micropipette Tips 200 µL Yellow (Rack of 96)', category: 'Equipment', formula: 'PP (Polypropylene)', formulaPlain: 'PP (Polypropylene)', quantity: '15', unit: 'racks', location: 'Cupboard 1 (67)', block: 'Cupboard 1 (67)', grade: 'Universal Fit', notes: 'Graduated yellow tips in polypropylene rack.' },
  { itemNo: 255, name: 'Micropipette Tips 1000 µL Blue (Rack of 96)', category: 'Equipment', formula: 'PP (Polypropylene)', formulaPlain: 'PP (Polypropylene)', quantity: '12', unit: 'racks', location: 'Cupboard 1 (67)', block: 'Cupboard 1 (67)', grade: 'Universal Fit', notes: 'Graduated blue tips in polypropylene box.' },
  { itemNo: 256, name: 'Microcentrifuge Tubes 1.5 mL Graduated (Box of 500)', category: 'Equipment', formula: 'PP (Polypropylene)', formulaPlain: 'PP (Polypropylene)', quantity: '5', unit: 'boxes', location: 'Cupboard 1 (67)', block: 'Cupboard 1 (67)', grade: 'Boil-Proof Lock', notes: 'Safe-lock snap cap with frosted writing area.' },
  { itemNo: 257, name: 'Centrifuge Tubes 15 mL Conical Polypropylene (Rack of 50)', category: 'Equipment', formula: 'PP (Polypropylene)', formulaPlain: 'PP (Polypropylene)', quantity: '6', unit: 'racks', location: 'Cupboard 1 (67)', block: 'Cupboard 1 (67)', grade: 'Sterile / Graduated', notes: 'Screw cap, conical bottom, 12,000 x g rated.' },
  { itemNo: 258, name: 'Centrifuge Tubes 50 mL Conical Polypropylene (Rack of 25)', category: 'Equipment', formula: 'PP (Polypropylene)', formulaPlain: 'PP (Polypropylene)', quantity: '6', unit: 'racks', location: 'Cupboard 1 (67)', block: 'Cupboard 1 (67)', grade: 'Sterile / Graduated', notes: 'High clarity tube with printed scale and writing patch.' },

  // Laboratory Hardware, Clamping & Stand Accessories (Cupboard 55)
  { itemNo: 259, name: 'Heavy Cast Iron Retort Stand Base (200 x 125 mm) with Rod (600 mm)', category: 'Equipment', formula: 'Cast Iron / Steel', formulaPlain: 'Cast Iron / Steel', quantity: '12', unit: 'sets', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Corrosion Resistant', notes: 'Heavy rectangular base with chrome plated steel rod.' },
  { itemNo: 260, name: 'Four-Prong Swivel Extension Clamp (Cork Lined)', category: 'Equipment', formula: 'Alloy / Cork', formulaPlain: 'Alloy / Cork', quantity: '15', unit: 'pcs', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Universal Clamp', notes: '360 degree swivel head for apparatus holding.' },
  { itemNo: 261, name: 'Three-Prong Dual Adjust Extension Clamp (Vinyl Lined)', category: 'Equipment', formula: 'Diecast Alloy', formulaPlain: 'Diecast Alloy', quantity: '15', unit: 'pcs', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Dual Screw', notes: 'Independently adjustable jaws for glassware protection.' },
  { itemNo: 262, name: 'Burette Clamp Double (Plastic Coated Spring Steel)', category: 'Equipment', formula: 'Steel / Polypropylene', formulaPlain: 'Steel / Polypropylene', quantity: '8', unit: 'pcs', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Double Titration', notes: 'Holds two burettes simultaneously without obscuring graduations.' },
  { itemNo: 263, name: 'Burette Clamp Single (Diecast Aluminum)', category: 'Equipment', formula: 'Aluminum Alloy', formulaPlain: 'Aluminum Alloy', quantity: '10', unit: 'pcs', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Single Clamp', notes: 'Spring loaded jaw for secure burette holding.' },
  { itemNo: 264, name: 'Bosshead / Clamp Holder (Right Angle Cast Iron)', category: 'Equipment', formula: 'Cast Iron / Brass', formulaPlain: 'Cast Iron / Brass', quantity: '25', unit: 'pcs', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Standard 16 mm', notes: 'Offset screws for clamping rods up to 16 mm diameter.' },
  { itemNo: 265, name: 'Retort Ring 75 mm Diameter with Extension Arm', category: 'Equipment', formula: 'Mild Steel', formulaPlain: 'Mild Steel', quantity: '10', unit: 'pcs', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Zinc Plated', notes: 'For supporting funnels, water baths, and beakers.' },
  { itemNo: 266, name: 'Retort Ring 100 mm Diameter with Bosshead', category: 'Equipment', formula: 'Mild Steel', formulaPlain: 'Mild Steel', quantity: '8', unit: 'pcs', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Integrated Bosshead', notes: 'Direct clamp support ring.' },
  { itemNo: 267, name: 'Cast Iron Tripod Stand (Height 200 mm, Ring 125 mm)', category: 'Equipment', formula: 'Cast Iron', formulaPlain: 'Cast Iron', quantity: '12', unit: 'pcs', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Heavy Duty', notes: 'Stable three-leg stand for Bunsen burner heating.' },
  { itemNo: 268, name: 'Ceramic Centered Wire Gauze (150 x 150 mm)', category: 'Equipment', formula: 'Galvanized Steel/Ceramic', formulaPlain: 'Steel/Ceramic', quantity: '20', unit: 'pcs', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Heat Diffuser', notes: 'Asbestos-free ceramic core for even heat distribution.' },
  { itemNo: 269, name: 'Clay Pipe Triangle 50 mm (Silica Pipe)', category: 'Equipment', formula: 'Ceramic / Steel Wire', formulaPlain: 'Ceramic / Steel Wire', quantity: '15', unit: 'pcs', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'High Temp Support', notes: 'Pipeclay triangle for holding crucibles over flame.' },
  { itemNo: 270, name: 'Bunsen Burner with Air Regulator (LP Gas)', category: 'Equipment', formula: 'Brass / Diecast Base', formulaPlain: 'Brass / Diecast Base', quantity: '10', unit: 'pcs', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Flame Adjustable', notes: 'Heavy cast base with brass air mixing sleeve and gas inlet.' },
  { itemNo: 271, name: 'Meker-Fisher High Temperature Burner', category: 'Equipment', formula: 'Nickel-Plated Brass', formulaPlain: 'Nickel-Plated Brass', quantity: '3', unit: 'pcs', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'High Heat (1200°C)', notes: 'Expanded grid top producing compact intense heating flame.' },
  { itemNo: 272, name: 'Crucible Tongs 200 mm (Stainless Steel)', category: 'Equipment', formula: 'Stainless Steel 304', formulaPlain: 'Stainless Steel 304', quantity: '12', unit: 'pcs', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Corrugate Jaw', notes: 'Bowed tips for safely gripping hot crucibles and dishes.' },
  { itemNo: 273, name: 'Beaker Tongs 250 mm (Rubber Sleeved Jaws)', category: 'Equipment', formula: 'Stainless Steel / Rubber', formulaPlain: 'Stainless Steel / Rubber', quantity: '8', unit: 'pcs', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Non-Slip Gripping', notes: 'Plastisol coated jaws for handling hot beakers up to 1000 mL.' },
  { itemNo: 274, name: 'Test Tube Holder (Spring Steel with Wooden Finger Grip)', category: 'Equipment', formula: 'Spring Steel / Wood', formulaPlain: 'Spring Steel / Wood', quantity: '20', unit: 'pcs', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Heat Insulated Grip', notes: 'Spring-loaded self-closing clamp.' },
  { itemNo: 275, name: 'Test Tube Rack 24-Hole (Polypropylene Autoclavable)', category: 'Equipment', formula: 'PP (Polypropylene)', formulaPlain: 'PP (Polypropylene)', quantity: '10', unit: 'pcs', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: '3-Tier Submersible', notes: 'Alpha-numeric grid indexing for 16–20 mm tubes.' },
  { itemNo: 276, name: 'Test Tube Rack 12-Hole with 6 Drying Pins (Wooden)', category: 'Equipment', formula: 'Hardwood', formulaPlain: 'Hardwood', quantity: '8', unit: 'pcs', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Traditional Wood', notes: 'Varnished hardwood with vertical draining pegs.' },
  { itemNo: 277, name: 'Laboratory Stainless Steel Spatula 150 mm (Spoon / Flat)', category: 'Equipment', formula: 'Stainless Steel 304', formulaPlain: 'Stainless Steel 304', quantity: '25', unit: 'pcs', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Chemical Resistant', notes: 'One end scoop spoon, other end flat blade.' },
  { itemNo: 278, name: 'Micro Spatula 150 mm (Flat / Bent Tip)', category: 'Equipment', formula: 'Stainless Steel 304', formulaPlain: 'Stainless Steel 304', quantity: '15', unit: 'pcs', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Analytical Micro', notes: 'For handling minute analytical powder quantities.' },
  { itemNo: 279, name: 'Stainless Steel Forceps / Tweezers 125 mm (Blunt Serrated)', category: 'Equipment', formula: 'Stainless Steel', formulaPlain: 'Stainless Steel', quantity: '12', unit: 'pcs', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Precision Gripping', notes: 'Serrated tips for picking balance weights and samples.' },
  { itemNo: 280, name: 'PTFE Magnetic Stirring Bars (Octagonal with Pivot Ring, 25 x 8 mm)', category: 'Equipment', formula: 'PTFE / Alnico V', formulaPlain: 'PTFE / Alnico V', quantity: '20', unit: 'pcs', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Chemically Inert', notes: 'Octagonal stir bar with center pivot ring for turbulence.' },
  { itemNo: 281, name: 'PTFE Magnetic Stirring Bars (Octagonal with Pivot Ring, 35 x 9 mm)', category: 'Equipment', formula: 'PTFE / Alnico V', formulaPlain: 'PTFE / Alnico V', quantity: '15', unit: 'pcs', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Chemically Inert', notes: 'Heavy duty magnetic flea for large volume mixing.' },
  { itemNo: 282, name: 'Magnetic Stir Bar Retriever 300 mm (PTFE Coated Rod)', category: 'Equipment', formula: 'PTFE / Permanent Magnet', formulaPlain: 'PTFE / Permanent Magnet', quantity: '4', unit: 'pcs', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Chemical Resistant', notes: 'Strong permanent magnet tip for retrieving stir bars.' },
  { itemNo: 283, name: 'Laboratory Thermometer -10°C to +110°C (Red Spirit Filled)', category: 'Equipment', formula: 'Glass / Non-Toxic Spirit', formulaPlain: 'Glass / Spirit', quantity: '15', unit: 'pcs', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Partial Immersion', notes: 'Yellow back glass with 1°C division.' },
  { itemNo: 284, name: 'Laboratory Thermometer -10°C to +250°C (Mercury / Safe Spirit)', category: 'Equipment', formula: 'Glass / Precision Fluid', formulaPlain: 'Glass / Precision Fluid', quantity: '10', unit: 'pcs', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'High Range', notes: 'Total immersion high temperature scale.' },
  { itemNo: 285, name: 'Digital Probe Thermometer (-50°C to +300°C Stainless Stem)', category: 'Equipment', formula: 'Electronic / SS304', formulaPlain: 'Electronic / SS304', quantity: '4', unit: 'units', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Fast Response LCD', notes: '145 mm pointed stainless steel probe with protective sleeve.' },
  { itemNo: 286, name: 'Laboratory Wash Bottle 250 mL (LDPE Narrow Mouth)', category: 'Equipment', formula: 'LDPE (Polyethylene)', formulaPlain: 'LDPE (Polyethylene)', quantity: '12', unit: 'pcs', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Flexible Squeeze', notes: 'Integral delivery tube with fine jet nozzle for distilled water.' },
  { itemNo: 287, name: 'Laboratory Wash Bottle 500 mL (LDPE Wide Mouth)', category: 'Equipment', formula: 'LDPE (Polyethylene)', formulaPlain: 'LDPE (Polyethylene)', quantity: '15', unit: 'pcs', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Flexible Squeeze', notes: 'Wide neck wash bottle with color-coded dispensing tube.' },
  { itemNo: 288, name: 'Acetone Safety Venting Wash Bottle 500 mL (Red Labeled)', category: 'Equipment', formula: 'LDPE (Vented Cap)', formulaPlain: 'LDPE (Vented Cap)', quantity: '6', unit: 'pcs', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Safety Labeled', notes: 'Pre-printed GHS symbols with automatic pressure release valve.' },
  { itemNo: 289, name: 'Ethanol Safety Venting Wash Bottle 500 mL (Green Labeled)', category: 'Equipment', formula: 'LDPE (Vented Cap)', formulaPlain: 'LDPE (Vented Cap)', quantity: '6', unit: 'pcs', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Safety Labeled', notes: 'Pre-printed chemical identification with zero-drip nozzle.' },
  { itemNo: 290, name: 'Test Tube Cleaning Brush (Nylon Bristle with Fan Tip, 20 mm)', category: 'Equipment', formula: 'Nylon / Galvanized Wire', formulaPlain: 'Nylon / Galvanized Wire', quantity: '20', unit: 'pcs', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Scratch-Proof Tip', notes: 'Tufted radial end protects glass bottoms.' },
  { itemNo: 291, name: 'Burette Cleaning Brush 600 mm (Long Handle)', category: 'Equipment', formula: 'Nylon / Wire', formulaPlain: 'Nylon / Wire', quantity: '8', unit: 'pcs', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Extra Long', notes: 'Flexible wire spine for scrubbing full length of 50 mL burettes.' },
  { itemNo: 292, name: 'Flask Cleaning Brush (Curved Swivel Head)', category: 'Equipment', formula: 'Nylon / Wooden Handle', formulaPlain: 'Nylon / Wooden Handle', quantity: '6', unit: 'pcs', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Conical Shape', notes: 'Hinged bent joint expands inside flasks.' },
  { itemNo: 293, name: 'Rubber Stopper Assortment (Solid, 1-Hole, 2-Hole #0 to #10)', category: 'Equipment', formula: 'Natural Vulcanized Rubber', formulaPlain: 'Natural Rubber', quantity: '100', unit: 'pcs', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Elastic Non-Hardening', notes: 'Assorted sizes for test tubes, flasks, and gas generators.' },
  { itemNo: 294, name: 'Silicone Tubing 6 mm ID x 9 mm OD (Laboratory Grade, 10 Meters)', category: 'Equipment', formula: 'Silicone Elastomer', formulaPlain: 'Silicone Elastomer', quantity: '3', unit: 'rolls', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Autoclavable (-50 to 200°C)', notes: 'High flexibility, non-toxic tubing for water condensers.' },
  { itemNo: 295, name: 'Thick Wall Rubber Vacuum Tubing 8 mm ID x 16 mm OD (5 Meters)', category: 'Equipment', formula: 'Heavy Rubber', formulaPlain: 'Heavy Rubber', quantity: '2', unit: 'rolls', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Non-Collapsing', notes: 'Reinforced wall resists vacuum collapse for aspirators.' },
  { itemNo: 296, name: 'Parafilm M Laboratory Sealing Film (4 inches x 125 ft Roll)', category: 'Equipment', formula: 'Polyolefin/Paraffin', formulaPlain: 'Polyolefin/Paraffin', quantity: '4', unit: 'rolls', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Moisture Barrier', notes: 'Self-sealing, moldable thermoplastic film for beakers and flasks.' },
  { itemNo: 297, name: 'Whatman No. 1 Qualitative Filter Paper Circles 110 mm (Box of 100)', category: 'Equipment', formula: 'Cellulose 100%', formulaPlain: 'Cellulose', quantity: '10', unit: 'boxes', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Medium Retention (11 µm)', notes: 'Standard qualitative clarification and separation filter.' },
  { itemNo: 298, name: 'Whatman No. 42 Ashless Quantitative Filter Paper 110 mm (Box of 100)', category: 'Equipment', formula: 'Pure Alpha Cotton', formulaPlain: 'Cotton Cellulose', quantity: '6', unit: 'boxes', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Slow / Fine (2.5 µm)', notes: 'High retention gravimetric analytical filter paper.' },
  { itemNo: 299, name: 'Universal pH Indicator Paper Strips pH 1–14 (Booklet of 80 Strips)', category: 'Equipment', formula: 'Indicator Dyes', formulaPlain: 'Indicator Dyes', quantity: '20', unit: 'booklets', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Full pH Scale 1-14', notes: 'Includes distinct 4-color comparison standard card.' },
  { itemNo: 300, name: 'Litmus Paper Blue Strips (Vial of 100 Strips)', category: 'Equipment', formula: 'Litmus Dye', formulaPlain: 'Litmus Dye', quantity: '10', unit: 'vials', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Acid Indicator', notes: 'Turns red under acidic conditions.' },
  { itemNo: 301, name: 'Litmus Paper Red Strips (Vial of 100 Strips)', category: 'Equipment', formula: 'Litmus Dye', formulaPlain: 'Litmus Dye', quantity: '10', unit: 'vials', location: 'Cupboard 1 (55)', block: 'Cupboard 1 (55)', grade: 'Base Indicator', notes: 'Turns blue under alkaline conditions.' }
];

// 4. The 29 user-requested items (ItemNo 302 - 330)
const rawNewChemicals = [
  { itemNo: 302, originalNo: 1, name: 'Acetic Acid', quantity: '2', unit: 'Cans', purityNotes: 'Can', formula: 'CH₃COOH', formulaPlain: 'CH3COOH', category: 'Chemical', location: 'Acid Cabinet', block: 'Acid Cabinet', grade: 'Glacial', casNumber: '64-19-7', hazardClass: 'Corrosive / Flammable Liquid', notes: 'Packaging: Can. Glacial organic carboxylic acid.' },
  { itemNo: 303, originalNo: 2, name: 'Acetone', quantity: '3', unit: 'Bottles', purityNotes: '', formula: 'CH₃COCH₃', formulaPlain: 'CH3COCH3', category: 'Chemical', location: 'Solvent Cabinet', block: 'Solvent Cabinet', grade: 'Reagent Grade', casNumber: '67-64-1', hazardClass: 'Flammable Liquid / Irritant', notes: 'Volatile organic ketone solvent for organic synthesis and cleaning.' },
  { itemNo: 304, originalNo: 3, name: 'Butanol', quantity: '', unit: '', purityNotes: '', formula: 'C₄H₉OH', formulaPlain: 'C4H9OH', category: 'Chemical', location: 'Solvent Cabinet', block: 'Solvent Cabinet', grade: 'Reagent Grade', casNumber: '71-36-3', hazardClass: 'Flammable Liquid / Irritant', notes: '1-Butanol / n-Butyl alcohol organic solvent.' },
  { itemNo: 305, originalNo: 4, name: 'Calcium Chloride Dihydrate', quantity: '3', unit: 'Bottles', purityNotes: 'Powder', formula: 'CaCl₂·2H₂O', formulaPlain: 'CaCl2.2H2O', category: 'Chemical', location: 'Main Storage', block: 'Main Storage', grade: 'Powder', casNumber: '10035-04-8', hazardClass: 'Eye Irritant', notes: 'Form: Powder. Inorganic salt and drying agent / desiccant.' },
  { itemNo: 306, originalNo: 5, name: 'Chlorobenzene', quantity: '1', unit: 'Bottle', purityNotes: '', formula: 'C₆H₅Cl', formulaPlain: 'C6H5Cl', category: 'Chemical', location: 'Solvent Cabinet', block: 'Solvent Cabinet', grade: 'Reagent Grade', casNumber: '108-90-7', hazardClass: 'Flammable Liquid / Toxic', notes: 'Aromatic halogenated organic solvent.' },
  { itemNo: 307, originalNo: 6, name: 'Cyclohexanone', quantity: '1', unit: 'Bottle', purityNotes: '', formula: 'C₆H₁₀O', formulaPlain: 'C6H10O', category: 'Chemical', location: 'Solvent Cabinet', block: 'Solvent Cabinet', grade: 'Reagent Grade', casNumber: '108-94-1', hazardClass: 'Flammable Liquid / Harmful', notes: 'Cyclic ketone organic solvent.' },
  { itemNo: 308, originalNo: 7, name: 'Diethyl Carbonate', quantity: '2', unit: 'Bottles', purityNotes: '', formula: 'C₅H₁₀O₃', formulaPlain: 'C5H10O3', category: 'Chemical', location: 'Solvent Cabinet', block: 'Solvent Cabinet', grade: 'Reagent Grade', casNumber: '105-58-8', hazardClass: 'Flammable Liquid', notes: 'Ethyl ester of carbonic acid, electrolyte solvent.' },
  { itemNo: 309, originalNo: 8, name: 'Diethyl Ether', quantity: '1', unit: 'Bottle', purityNotes: '', formula: '(C₂H₅)₂O', formulaPlain: '(C2H5)2O', category: 'Chemical', location: 'Solvent Cabinet', block: 'Solvent Cabinet', grade: 'Reagent Grade', casNumber: '60-29-7', hazardClass: 'Extremely Flammable Liquid', notes: 'Highly volatile, flammable ether solvent.' },
  { itemNo: 310, originalNo: 9, name: 'Dimethyl Carbonate', quantity: '1', unit: 'Bottle', purityNotes: '', formula: 'C₃H₆O₃', formulaPlain: 'C3H6O3', category: 'Chemical', location: 'Solvent Cabinet', block: 'Solvent Cabinet', grade: 'Reagent Grade', casNumber: '616-38-6', hazardClass: 'Highly Flammable Liquid', notes: 'Methylating agent and organic solvent.' },
  { itemNo: 311, originalNo: 10, name: 'Dimethyl Sulphoxide (DMSO)', quantity: '1', unit: 'Bottle', purityNotes: '', formula: '(CH₃)₂SO', formulaPlain: '(CH3)2SO', category: 'Chemical', location: 'Solvent Cabinet', block: 'Solvent Cabinet', grade: 'Reagent Grade', casNumber: '67-68-5', hazardClass: 'Combustible Liquid', notes: 'Polar aprotic solvent.' },
  { itemNo: 312, originalNo: 11, name: 'Ethyl Acetate', quantity: '1', unit: 'Bottle', purityNotes: '', formula: 'CH₃COOCH₂CH₃', formulaPlain: 'CH3COOCH2CH3', category: 'Chemical', location: 'Solvent Cabinet', block: 'Solvent Cabinet', grade: 'Reagent Grade', casNumber: '141-78-6', hazardClass: 'Highly Flammable Liquid / Eye Irritant', notes: 'Organic ester solvent.' },
  { itemNo: 313, originalNo: 12, name: 'Ethyl Alcohol', quantity: '1', unit: 'Bottle', purityNotes: '', formula: 'C₂H₅OH', formulaPlain: 'C2H5OH', category: 'Chemical', location: 'Solvent Cabinet', block: 'Solvent Cabinet', grade: 'Reagent Grade', casNumber: '64-17-5', hazardClass: 'Highly Flammable Liquid', notes: 'Absolute Ethanol alcohol solvent.' },
  { itemNo: 314, originalNo: 13, name: 'Ethylene Carbonate', quantity: '2', unit: 'Bottles', purityNotes: '99% (One in refrigerator)', formula: 'C₃H₄O₃', formulaPlain: 'C3H4O3', category: 'Chemical', location: 'Storage / Refrigerator', block: 'Refrigerator', grade: '99%', casNumber: '96-49-1', hazardClass: 'Harmful / Eye Irritant', notes: 'Purity: 99%. 1 bottle in general storage, 1 bottle in Refrigerator.' },
  { itemNo: 315, originalNo: 14, name: 'Formaldehyde Solution', quantity: '1', unit: 'Bottle', purityNotes: '', formula: 'CH₂O', formulaPlain: 'CH2O', category: 'Chemical', location: 'Main Storage', block: 'Main Storage', grade: 'Solution', casNumber: '50-00-0', hazardClass: 'Toxic / Carcinogen / Corrosive', notes: 'Aqueous formalin solution.' },
  { itemNo: 316, originalNo: 15, name: 'Formic Acid', quantity: '2', unit: 'Bottles', purityNotes: '98%', formula: 'HCOOH', formulaPlain: 'HCOOH', category: 'Chemical', location: 'Acid Cabinet', block: 'Acid Cabinet', grade: '98%', casNumber: '64-18-6', hazardClass: 'Corrosive / Flammable Liquid', notes: 'Purity: 98%. Methanoic acid, corrosive carboxylic acid.' },
  { itemNo: 317, originalNo: 16, name: 'Glycerin', quantity: '', unit: '', purityNotes: '', formula: 'C₃H₈O₃', formulaPlain: 'C3H8O3', category: 'Chemical', location: 'Main Storage', block: 'Main Storage', grade: 'Pure', casNumber: '56-81-5', hazardClass: 'Non-Hazardous Reagent', notes: 'Glycerol, viscous triol compound.' },
  { itemNo: 318, originalNo: 17, name: 'Heptane', quantity: '1', unit: 'Bottle', purityNotes: '', formula: 'C₇H₁₆', formulaPlain: 'C7H16', category: 'Chemical', location: 'Solvent Cabinet', block: 'Solvent Cabinet', grade: 'Reagent Grade', casNumber: '142-82-5', hazardClass: 'Highly Flammable Liquid / Aspiration Hazard', notes: 'Non-polar alkane hydrocarbon solvent.' },
  { itemNo: 319, originalNo: 18, name: 'H₂O₂ (Hydrogen Peroxide)', quantity: '', unit: '', purityNotes: '', formula: 'H₂O₂', formulaPlain: 'H2O2', category: 'Chemical', location: 'Oxidizer Storage', block: 'Refrigerator', grade: 'Oxidizer Grade', casNumber: '7722-84-1', hazardClass: 'Oxidizing Liquid / Corrosive', notes: 'Hydrogen Peroxide aqueous solution, strong oxidizing agent.' },
  { itemNo: 320, originalNo: 19, name: 'Lactic Acid', quantity: '', unit: '', purityNotes: '', formula: 'C₃H₆O₃', formulaPlain: 'C3H6O3', category: 'Chemical', location: 'Main Storage', block: 'Main Storage', grade: 'Pure', casNumber: '50-21-5', hazardClass: 'Skin / Eye Corrosive', notes: '2-Hydroxypropanoic acid.' },
  { itemNo: 321, originalNo: 20, name: 'm-Cresol', quantity: '1', unit: 'Bottle', purityNotes: '', formula: 'C₇H₈O', formulaPlain: 'C7H8O', category: 'Chemical', location: 'Solvent Cabinet', block: 'Solvent Cabinet', grade: 'Pure', casNumber: '108-39-4', hazardClass: 'Toxic / Corrosive', notes: 'Organic aromatic phenol derivative (3-methylphenol).' },
  { itemNo: 322, originalNo: 21, name: 'Methanol', quantity: '3', unit: 'Bottles', purityNotes: '', formula: 'CH₃OH', formulaPlain: 'CH3OH', category: 'Chemical', location: 'Solvent Cabinet', block: 'Solvent Cabinet', grade: 'Reagent Grade', casNumber: '67-56-1', hazardClass: 'Highly Flammable Liquid / Toxic', notes: 'Methyl alcohol solvent for HPLC and laboratory synthesis.' },
  { itemNo: 323, originalNo: 22, name: 'Methyl Amine Solution', quantity: '1', unit: 'Bottle', purityNotes: '', formula: 'CH₃NH₂', formulaPlain: 'CH3NH2', category: 'Chemical', location: 'Main Storage', block: 'Main Storage', grade: 'Solution', casNumber: '74-89-5', hazardClass: 'Flammable / Corrosive / Toxic', notes: 'Monomethylamine aqueous solution.' },
  { itemNo: 324, originalNo: 23, name: 'N,N-Dimethylformamide (DMF)', quantity: '1', unit: 'Bottle', purityNotes: '', formula: 'HCON(CH₃)₂', formulaPlain: 'HCON(CH3)2', category: 'Chemical', location: 'Solvent Cabinet', block: 'Solvent Cabinet', grade: 'AR', casNumber: '68-12-2', hazardClass: 'Flammable Liquid / Reproductive Toxin', notes: 'Polar aprotic solvent for peptide synthesis and chemical reactions.' },
  { itemNo: 325, originalNo: 24, name: 'PEG 400', quantity: '1', unit: 'Bottle', purityNotes: '', formula: 'H(OCH₂CH₂)ₙOH', formulaPlain: 'H(OCH2CH2)nOH', category: 'Chemical', location: 'Main Storage', block: 'Main Storage', grade: 'Polymer', casNumber: '25322-68-3', hazardClass: 'Non-Hazardous Polymer', notes: 'Polyethylene Glycol 400 average molecular weight.' },
  { itemNo: 326, originalNo: 25, name: 'Phosphoric Acid', quantity: '1', unit: 'Can', purityNotes: 'Can', formula: 'H₃PO₄', formulaPlain: 'H3PO4', category: 'Chemical', location: 'Acid Cabinet', block: 'Acid Cabinet', grade: 'Technical / Pure', casNumber: '7664-38-2', hazardClass: 'Corrosive', notes: 'Packaging: Can. Orthophosphoric acid.' },
  { itemNo: 327, originalNo: 26, name: 'Sulphuric Acid', quantity: '2', unit: 'Bottles', purityNotes: '98%', formula: 'H₂SO₄', formulaPlain: 'H2SO4', category: 'Chemical', location: 'Acid Cabinet', block: 'Acid Cabinet', grade: '98%', casNumber: '7664-93-9', hazardClass: 'Highly Corrosive Mineral Acid', notes: 'Purity: 98% concentrated sulfuric acid. Highly corrosive strong mineral acid.' },
  { itemNo: 328, originalNo: 27, name: 'Titanium Tetrachloride (TiCl₄)', quantity: '3', unit: 'Bottles', purityNotes: '2 in refrigerator', formula: 'TiCl₄', formulaPlain: 'TiCl4', category: 'Chemical', location: 'Refrigerator / Cabinet', block: 'Refrigerator', grade: 'Anhydrous', casNumber: '7550-45-0', hazardClass: 'Corrosive / Water Reactive / Toxic', notes: 'Storage: 2 in refrigerator, 1 in cabinet. Moisture-sensitive fuming liquid.' },
  { itemNo: 329, originalNo: 28, name: 'Titanium Tetraisopropoxide (TTIP)', quantity: '4', unit: 'Bottles', purityNotes: '', formula: 'Ti[OCH(CH₃)₂]₄', formulaPlain: 'Ti[OCH(CH3)2]4', category: 'Chemical', location: 'Main Storage', block: 'Main Storage', grade: 'Pure TTIP', casNumber: '546-68-9', hazardClass: 'Flammable Liquid / Moisture Sensitive', notes: 'Titanium(IV) isopropoxide precursor for titanium dioxide nanomaterials.' },
  { itemNo: 330, originalNo: 29, name: 'TMOET - Ti[OCH(CH₃)₂]₄', quantity: '', unit: '', purityNotes: '', formula: 'Ti[OCH(CH₃)₂]₄', formulaPlain: 'Ti[OCH(CH3)2]4', category: 'Chemical', location: 'Main Storage', block: 'Main Storage', grade: 'Titanium Alkoxide', casNumber: '546-68-9', hazardClass: 'Flammable / Moisture Sensitive', notes: 'Titanium alkoxide precursor / sol-gel reagent.' }
];

// Combine all sets: 112 chemicals + 104 glassware + 85 equipment + 29 new chemicals = 330 items
const allItems = [];

// Add 112 chemicals
rawChemicals.forEach(c => {
  const plainSearch = [
    c.itemNo,
    c.name,
    c.category || 'Chemical',
    c.formula,
    c.formulaPlain,
    c.quantity,
    c.unit,
    c.location,
    c.block,
    c.grade || '',
    c.notes || ''
  ].filter(Boolean).join(' ').toLowerCase();

  allItems.push({
    id: `chem-${c.itemNo}`,
    itemNo: c.itemNo,
    name: c.name,
    category: 'Chemical',
    formula: c.formula,
    formulaPlain: c.formulaPlain,
    quantity: c.quantity || '',
    unit: c.unit || '',
    location: c.location || c.block,
    block: c.block,
    grade: c.grade || (c.name.includes('AR') ? 'AR Grade' : c.name.includes('Extra Pure') ? 'Extra Pure' : 'Laboratory Grade'),
    notes: c.notes || '',
    purityNotes: '',
    searchText: plainSearch
  });
});

// Add 104 glassware
rawGlassware.forEach(g => {
  const plainSearch = [
    g.itemNo,
    g.name,
    g.category,
    g.formula,
    g.formulaPlain,
    g.quantity,
    g.unit,
    g.location,
    g.block,
    g.grade,
    g.notes
  ].filter(Boolean).join(' ').toLowerCase();

  allItems.push({
    id: `glass-${g.itemNo}`,
    itemNo: g.itemNo,
    name: g.name,
    category: g.category,
    formula: g.formula,
    formulaPlain: g.formulaPlain,
    quantity: g.quantity,
    unit: g.unit,
    location: g.location,
    block: g.block,
    grade: g.grade,
    notes: g.notes,
    purityNotes: '',
    searchText: plainSearch
  });
});

// Add 85 equipment
rawEquipment.forEach(e => {
  const plainSearch = [
    e.itemNo,
    e.name,
    e.category,
    e.formula,
    e.formulaPlain,
    e.quantity,
    e.unit,
    e.location,
    e.block,
    e.grade,
    e.notes
  ].filter(Boolean).join(' ').toLowerCase();

  allItems.push({
    id: `equip-${e.itemNo}`,
    itemNo: e.itemNo,
    name: e.name,
    category: e.category,
    formula: e.formula,
    formulaPlain: e.formulaPlain,
    quantity: e.quantity,
    unit: e.unit,
    location: e.location,
    block: e.block,
    grade: e.grade,
    notes: e.notes,
    purityNotes: '',
    searchText: plainSearch
  });
});

// Add 29 new chemicals
rawNewChemicals.forEach(nc => {
  const plainSearch = [
    nc.itemNo,
    `#${nc.originalNo}`,
    nc.name,
    nc.category,
    nc.formula,
    nc.formulaPlain,
    nc.quantity,
    nc.unit,
    nc.location,
    nc.block,
    nc.grade,
    nc.casNumber,
    nc.hazardClass,
    nc.purityNotes,
    nc.notes
  ].filter(Boolean).join(' ').toLowerCase();

  allItems.push({
    id: `chem-${nc.itemNo}`,
    itemNo: nc.itemNo,
    name: nc.name,
    category: nc.category,
    formula: nc.formula,
    formulaPlain: nc.formulaPlain,
    quantity: nc.quantity,
    unit: nc.unit,
    location: nc.location,
    block: nc.block,
    grade: nc.grade,
    notes: nc.notes,
    purityNotes: nc.purityNotes,
    casNumber: nc.casNumber,
    hazardClass: nc.hazardClass,
    searchText: plainSearch
  });
});

console.log('Total combined database items:', allItems.length);
console.log('Breakdown:', {
  originalChemicals: rawChemicals.length,
  originalGlassware: rawGlassware.length,
  originalEquipment: rawEquipment.length,
  newChemicals: rawNewChemicals.length,
  total: allItems.length
});

// Write to files
fs.writeFileSync('data/inventory.json', JSON.stringify(allItems, null, 2), 'utf8');
fs.writeFileSync('data/inventory.js', 'window.LAB_INVENTORY = ' + JSON.stringify(allItems, null, 2) + ';\n', 'utf8');
fs.writeFileSync('data/glassware.json', JSON.stringify(rawGlassware, null, 2), 'utf8');
fs.writeFileSync('data/equipment.json', JSON.stringify(rawEquipment, null, 2), 'utf8');

if (fs.existsSync('public/data')) {
  fs.writeFileSync('public/data/inventory.json', JSON.stringify(allItems, null, 2), 'utf8');
  fs.writeFileSync('public/data/glassware.json', JSON.stringify(rawGlassware, null, 2), 'utf8');
  fs.writeFileSync('public/data/equipment.json', JSON.stringify(rawEquipment, null, 2), 'utf8');
}

const tsContent = `import { InventoryItem } from '../types';

export const INITIAL_INVENTORY: InventoryItem[] = ${JSON.stringify(allItems, null, 2)};
`;
fs.writeFileSync('src/data/inventoryData.ts', tsContent, 'utf8');

console.log('Database successfully built and synchronized across all target files!');
