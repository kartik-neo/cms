export const emergencySop = [
  {
    id: [14,29,37],
    title: "Adult Medical Emergency",
    code: "Blue (Adult)",
    colorCode: "#38bdf8",
    imageUrl: "../ecm/images/adult-medical-emergency.svg",
    // emergencyNum: "",
    emergencyNum: "3233222",
    response: "Call a 'Code Blue.' A medical emergency response team should rush to the location with a crash cart.",
    action: "Begin basic life support (CPR) if necessary. Administer appropriate medications or interventions based on the specific medical condition.",
    notification: "Notify the patient's primary care team and family members as needed.",
    documentation: "Detailed medical records should be maintained for the event.",
  },
  {
    id: [15,30,38],
    title: "Pediatric  Medical Emergency",
    code: "Blue (Peadiatric)",
    colorCode: "#38bdf8",
    imageUrl: "../ecm/images/pediatric-medical-emergency.svg",
    emergencyNum: "23233",
    response: "Call a 'Code Blue.' A pediatric emergency team should respond quickly.",
    action: "Administer pediatric-specific life support and treatments.",
    notification: "Notify the pediatric specialist or intensivist, and communicate with the family.",
    documentation: "Maintain detailed pediatric medical records.",
  },
  {
    id: [16,31,39],
    title: "Fire",
    code: "Red",
    colorCode: "#dc2626",
    imageUrl: "../ecm/images/fire.svg",
    emergencyNum: "4554",
    response: "Trigger the fire alarm system and call 'Code Red.' Evacuate patients according to hospital evacuation plans",
    action: "Utilize fire suppression equipment if safe. Ensure patient safety and perform rescues as needed.",
    notification: "Notify the fire department and provide them with all relevant information.",
    documentation: "Keep records of actions taken and patient evacuation details.",
  },
  {
    id: [17,32,40],
    title: "Physical Assault",
    code: "Purple",
    colorCode: "#9333ea",
    imageUrl: "../ecm/images/physical-assault.svg",
    emergencyNum: "565654",
    response: "Call a 'Code Purple.' Hospital security should respond to the location.",
    action: "Secure the area, protect patients, and detain the aggressor if necessary. Provide medical care to victims.",
    notification: "Notify law enforcement and document the incident.",
    documentation: "Detailed incident reports must be filed.",
  },
  {
    id: [18,33,41],
    title: "Child Abduction",
    code: "Pink",
    colorCode: "#ec4899",
    imageUrl: "../ecm/images/child-abduction.svg",
    emergencyNum: "5565",
    response: "Activate a 'Code Pink' or a similar pediatric emergency protocol",
    action: "Secure the facility, review security footage, and initiate a search for the missing child.",
    notification: "Notify law enforcement, the child's family, and relevant hospital personnel.",
    documentation: "Maintain records of actions taken and any information gathered.",
  },
  {
    id: [19,34,42],
    title: "Bomb Blast Disaster",
    code: "Black",
    colorCode: "#000000",
    imageUrl: "../ecm/images/bomb-blast-disaster.svg",
    emergencyNum: "12123",
    response: "Activate a 'Code Black' response.",
    action: "Ensure safety, evacuate if necessary, and provide immediate medical care.",
    notification: "Notify the authorities, local emergency services, and prepare for a surge in patients.",
    documentation: "Extensive records are crucial for incident analysis and insurance claims.",
  },
  {
    id: [20,35,43],
    title: "External Disaster (e.g., natural disasters)",
    code: "Grey",
    colorCode: "#94a3b8",
    imageUrl: "../ecm/images/external-disaster.svg",
    emergencyNum: "123",
    response: "Activate Code Grey.",
    action: "Ensure patient safety, emergency medical care, and potential evacuation.",
    notification: "Collaborate with local emergency services and authorities.",
    documentation: "Extensive records are essential for disaster recovery and legal purposes.",
  },
  {
    id: [21,36,44],
    title: "Hazmat (Hazardous Materials) Incident",
    code: "Hazmat",
    colorCode: "#16a34a",
    imageUrl: "../ecm/images/hazmat-incident.svg",
    emergencyNum: "1",
    response: "Activate 'Code Hazmat' or a similar hazardous materials emergency protocol.",
    action: "Secure the area, isolate patients with potential exposure, and decontaminate as necessary.",
    notification: "Notify relevant environmental agencies and personnel.",
    documentation: "Detailed records are essential for handling potential contamination and liability.",
  },
]