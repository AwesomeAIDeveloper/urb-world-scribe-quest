
export const urbKnowledge = {
  locations: [
    {
      name: "Richland",
      description: "The central urban hub of the URB world, a sprawling city of technological marvels and social inequities."
    },
    {
      name: "The Wastes",
      description: "Barren lands outside the urban centers, inhabited by nomadic tribes and dangerous creatures."
    },
    {
      name: "Solozo Enclaves",
      description: "Technologically advanced communities where the Solozo race develops and implements their innovations."
    },
    {
      name: "Barab Territories",
      description: "Rugged landscapes where the physically imposing Barab race makes their home, focusing on strength and tradition."
    },
    {
      name: "Twilight Zones",
      description: "Mystical regions where reality seems altered, home to the enigmatic Twilighter race with their special abilities."
    }
  ],
  races: [
    {
      name: "Solozo",
      description: "Technologically gifted humanoids with a profound understanding of machines and digital systems. They tend toward analytical thinking and often struggle with emotional expression."
    },
    {
      name: "Barab",
      description: "Physically powerful race with impressive natural strength and endurance. They value traditional ways and physical prowess over technological solutions."
    },
    {
      name: "Twilighter",
      description: "Mysterious race with inherent connections to the esoteric forces of the world. They often possess intuitive abilities that seem supernatural to others."
    }
  ],
  concepts: [
    {
      name: "Mathix",
      description: "A fundamental energy field that permeates the URB world. Those sensitive to it can manipulate reality in subtle ways."
    },
    {
      name: "Rax",
      description: "Physical manifestation of concentrated Mathix energy, often appearing as crystalline structures with unique properties."
    },
    {
      name: "Life Force",
      description: "The essential vitality that determines a being's overall health and survival capacity in the harsh URB world."
    },
    {
      name: "Explosion of Fate",
      description: "The concept behind the 'exploding dice' mechanic, representing how sometimes destiny produces extraordinary results beyond normal capabilities."
    }
  ],
  factions: [
    {
      name: "The Conclave",
      description: "Ruling council that governs Richland and attempts to maintain order across known territories."
    },
    {
      name: "Waste Walkers",
      description: "Nomadic groups that traverse the dangerous Wastes, trading information and salvage between settlements."
    },
    {
      name: "Mathix Seekers",
      description: "Organization dedicated to understanding and harnessing the power of the Mathix energy field."
    }
  ],
  coreNarratives: [
    {
      title: "The Great Divergence",
      content: "Long ago, the ancestors of the three races lived as one people. During a cataclysmic event called the Great Divergence, exposure to different concentrations of Mathix energy caused the population to evolve rapidly in different directions, leading to the Solozo, Barab, and Twilighter races we know today."
    },
    {
      title: "The Founding of Richland",
      content: "Centuries after the Great Divergence, representatives from all three races came together to establish Richland as a central hub where their different cultures could coexist and trade. Though tensions remain, this cooperative foundation has endured through many challenges."
    },
    {
      title: "The Rax Wars",
      content: "Fifty years ago, a massive Rax deposit was discovered in contested territory. The ensuing conflict between factions desperate to control this resource became known as the Rax Wars, reshaping political boundaries and leaving scars on the landscape that remain visible today."
    }
  ]
};

export function generateDMResponse(playerInput: string, character: any, session: any): string {
  // This is a placeholder for what would be an actual API call to an LLM
  // For demo purposes, we'll return canned responses based on keywords
  
  const input = playerInput.toLowerCase();
  
  if (input.includes("hello") || input.includes("hi ")) {
    return `Greetings, ${character.name} of the ${character.race} people. What brings you to these parts of the URB world? The paths before you are many, and fate's dice roll ever onward.`;
  }
  
  if (input.includes("richland") || input.includes("city")) {
    return `Richland stands as a testament to what cooperation between the races can achieve - and what conflicts remain unresolved. Its towers of gleaming metal reach toward the sky while the lower levels remain shrouded in perpetual shadow. The Conclave maintains order here, though their methods are not always gentle.`;
  }
  
  if (input.includes("solozo") || input.includes("technology")) {
    return `The Solozo approach everything with analytical precision. Their technological innovations power much of what makes modern life in the URB world possible, from the energy shields that protect settlements from the toxic winds to the communication networks that bind distant communities together. Their enclaves are marvels of efficiency, though outsiders often find them cold and sterile.`;
  }
  
  if (input.includes("barab") || input.includes("strength")) {
    return `The Barab believe in the wisdom of tradition and the undeniable truth of physical reality. Where the Solozo would build a machine to solve a problem, a Barab would train their body and mind to overcome it directly. Their territories are built to last, structures of stone and metal that withstand the harshest conditions the world has to offer.`;
  }
  
  if (input.includes("twilighter") || input.includes("mysterious")) {
    return `Few truly understand the Twilighters, even after centuries of coexistence. They perceive the Mathix in ways others cannot, sensing its currents and occasionally bending them to their will in subtle ways that seem like magic to the uninitiated. Their communities tend to form in regions where the Mathix flows strongly, places where reality itself seems slightly altered.`;
  }
  
  if (input.includes("mathix") || input.includes("energy")) {
    return `The Mathix permeates everything in our world, though most beings perceive it only indirectly - like feeling wind on your skin rather than seeing the air itself move. Twilighters have natural sensitivity to it. Solozo have developed instruments to detect and measure it. Barab often incorporate its principles into their traditional practices. Understanding the Mathix is the key to understanding the deeper nature of the URB world.`;
  }
  
  if (input.includes("rax") || input.includes("crystal")) {
    return `Rax crystals form where the Mathix energy concentrates and solidifies into physical form. Even a small fragment contains immense potential energy that can be harnessed in countless ways - powering Solozo technology, enhancing Barab physical abilities, or amplifying Twilighter perception. The largest deposits are heavily guarded, their control often determining the balance of power in a region.`;
  }
  
  // Default response if no keywords match
  return `You continue your journey through the URB world, where the three races maintain their uneasy balance and the mysteries of the Mathix await discovery. What action will you take next?`;
}

export default urbKnowledge;
