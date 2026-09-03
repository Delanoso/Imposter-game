export interface WordPair {
  civilianWord: string;
  imposterWord: string; // Used for "Undercover" mode where imposter gets a similar word, or hints
  hint?: string;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  description: string;
  isCustom?: boolean;
  words: WordPair[];
}

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'food-drinks',
    name: 'Food & Drinks',
    emoji: '🍕',
    description: 'Tasty dishes, snacks, desserts, and beverages',
    words: [
      { civilianWord: 'Pizza', imposterWord: 'Burger', hint: 'Fast food favorite' },
      { civilianWord: 'Sushi', imposterWord: 'Sashimi', hint: 'Japanese cuisine' },
      { civilianWord: 'Coffee', imposterWord: 'Black Tea', hint: 'Caffeinated morning beverage' },
      { civilianWord: 'Ice Cream', imposterWord: 'Frozen Yogurt', hint: 'Chilled sweet treat' },
      { civilianWord: 'Spaghetti', imposterWord: 'Ramen', hint: 'Noodle dish' },
      { civilianWord: 'Chocolate', imposterWord: 'Caramel', hint: 'Sweet candy indulgence' },
      { civilianWord: 'Pancake', imposterWord: 'Waffle', hint: 'Breakfast batter dish' },
      { civilianWord: 'Taco', imposterWord: 'Burrito', hint: 'Mexican street food' },
      { civilianWord: 'Croissant', imposterWord: 'Bagel', hint: 'Bakery staple' },
      { civilianWord: 'Hot Dog', imposterWord: 'Corndog', hint: 'Stadium snack' },
      { civilianWord: 'Milkshake', imposterWord: 'Smoothie', hint: 'Blended drink' },
      { civilianWord: 'Popcorn', imposterWord: 'Potato Chips', hint: 'Movie snack' },
      { civilianWord: 'Donut', imposterWord: 'Churro', hint: 'Fried sweet dough' },
      { civilianWord: 'Apple Pie', imposterWord: 'Cheesecake', hint: 'Classic dessert pie' },
      { civilianWord: 'Lemonade', imposterWord: 'Iced Tea', hint: 'Refreshing summer drink' },
      { civilianWord: 'Sandwich', imposterWord: 'Wrap', hint: 'Quick handheld lunch' },
      { civilianWord: 'Nachos', imposterWord: 'Quesadilla', hint: 'Cheesy snack' },
      { civilianWord: 'Cupcake', imposterWord: 'Muffin', hint: 'Individual baked treat' },
      { civilianWord: 'Guacamole', imposterWord: 'Salsa', hint: 'Dip for tortilla chips' },
      { civilianWord: 'Fried Chicken', imposterWord: 'Chicken Wings', hint: 'Crispy poultry snack' },
      { civilianWord: 'Boba Tea', imposterWord: 'Matcha Latte', hint: 'Trendy cafe drink' },
      { civilianWord: 'French Fries', imposterWord: 'Onion Rings', hint: 'Deep-fried side dish' },
      { civilianWord: 'Steak', imposterWord: 'Ribs', hint: 'Hearty meat entree' },
      { civilianWord: 'Churros', imposterWord: 'Cinnamon Roll', hint: 'Cinnamon spiced pastry' },
      { civilianWord: 'Cocktail', imposterWord: 'Mocktail', hint: 'Mixed party beverage' }
    ]
  },
  {
    id: 'animals-nature',
    name: 'Animals & Nature',
    emoji: '🦁',
    description: 'Wild beasts, pets, sea creatures, and habitats',
    words: [
      { civilianWord: 'Lion', imposterWord: 'Tiger', hint: 'Majestic big cat' },
      { civilianWord: 'Dolphin', imposterWord: 'Whale', hint: 'Smart aquatic mammal' },
      { civilianWord: 'Penguin', imposterWord: 'Puffin', hint: 'Flightless polar bird' },
      { civilianWord: 'Kangaroo', imposterWord: 'Wallaby', hint: 'Australian marsupial' },
      { civilianWord: 'Elephant', imposterWord: 'Mammoth', hint: 'Giant trunked beast' },
      { civilianWord: 'Eagle', imposterWord: 'Hawk', hint: 'Bird of prey with keen eyesight' },
      { civilianWord: 'Chameleon', imposterWord: 'Gecko', hint: 'Color-changing reptile' },
      { civilianWord: 'Octopus', imposterWord: 'Squid', hint: 'Eight-tentacled sea dweller' },
      { civilianWord: 'Cheetah', imposterWord: 'Leopard', hint: 'Fastest land animal' },
      { civilianWord: 'Koala', imposterWord: 'Panda', hint: 'Tree-hugging cuddly herbivore' },
      { civilianWord: 'Flamingo', imposterWord: 'Stork', hint: 'Pink wading bird' },
      { civilianWord: 'Gorilla', imposterWord: 'Chimpanzee', hint: 'Powerful great ape' },
      { civilianWord: 'Giraffe', imposterWord: 'Zebra', hint: 'Tall African savanna grazer' },
      { civilianWord: 'Wolf', imposterWord: 'Coyote', hint: 'Pack-hunting wild canine' },
      { civilianWord: 'Shark', imposterWord: 'Orca', hint: 'Apex oceanic predator' },
      { civilianWord: 'Hummingbird', imposterWord: 'Butterfly', hint: 'Rapid hovering pollinator' },
      { civilianWord: 'Volcano', imposterWord: 'Geyser', hint: 'Erupting geological feature' },
      { civilianWord: 'Rainforest', imposterWord: 'Jungle', hint: 'Dense tropical biodiversity biome' },
      { civilianWord: 'Waterfall', imposterWord: 'Rapids', hint: 'Cascading rushing water' },
      { civilianWord: 'Glacier', imposterWord: 'Iceberg', hint: 'Massive frozen ice mass' },
      { civilianWord: 'Peacock', imposterWord: 'Parrot', hint: 'Colorful feathered bird' },
      { civilianWord: 'Polar Bear', imposterWord: 'Grizzly Bear', hint: 'Apex Arctic predator' },
      { civilianWord: 'Crocodile', imposterWord: 'Alligator', hint: 'Armored wetland reptile' },
      { civilianWord: 'Desert Oasis', imposterWord: 'Mirage', hint: 'Water source in the sands' }
    ]
  },
  {
    id: 'pop-culture',
    name: 'Movies & Pop Culture',
    emoji: '🎬',
    description: 'Blockbusters, superheroes, gaming, and viral icons',
    words: [
      { civilianWord: 'Harry Potter', imposterWord: 'Lord of the Rings', hint: 'Fantasy franchise' },
      { civilianWord: 'Spider-Man', imposterWord: 'Batman', hint: 'Costumed comic superhero' },
      { civilianWord: 'Star Wars', imposterWord: 'Star Trek', hint: 'Space sci-fi universe' },
      { civilianWord: 'Minecraft', imposterWord: 'Roblox', hint: 'Block-building video game' },
      { civilianWord: 'Netflix', imposterWord: 'YouTube', hint: 'Streaming entertainment platform' },
      { civilianWord: 'Pokemon', imposterWord: 'Digimon', hint: 'Monster-collecting battle franchise' },
      { civilianWord: 'Avengers', imposterWord: 'Justice League', hint: 'Super hero superhero squad' },
      { civilianWord: 'Mario', imposterWord: 'Sonic', hint: 'Iconic retro platformer mascot' },
      { civilianWord: 'Barbie', imposterWord: 'Bratz', hint: 'Fashion doll culture' },
      { civilianWord: 'Fortnite', imposterWord: 'PUBG', hint: 'Battle royale shooter' },
      { civilianWord: 'Titanic', imposterWord: 'Avatar', hint: 'James Cameron box office titan' },
      { civilianWord: 'TikTok', imposterWord: 'Instagram Reels', hint: 'Viral short video app' },
      { civilianWord: 'James Bond', imposterWord: 'Mission: Impossible', hint: 'Secret agent espionage thriller' },
      { civilianWord: 'The Matrix', imposterWord: 'Inception', hint: 'Mind-bending simulation thriller' },
      { civilianWord: 'Shrek', imposterWord: 'Monsters, Inc.', hint: 'Beloved animated comedy' },
      { civilianWord: 'Squid Game', imposterWord: 'The Hunger Games', hint: 'Survival tournament drama' },
      { civilianWord: 'Taylor Swift', imposterWord: 'Beyonce', hint: 'Global pop superstar' },
      { civilianWord: 'Stranger Things', imposterWord: 'Wednesday', hint: 'Hit supernatural TV series' },
      { civilianWord: 'Zelda', imposterWord: 'Genshin Impact', hint: 'Open-world fantasy adventure' },
      { civilianWord: 'Iron Man', imposterWord: 'Cyborg', hint: 'Tech-powered armor hero' }
    ]
  },
  {
    id: 'everyday-items',
    name: 'Everyday Objects',
    emoji: '🎒',
    description: 'Household gadgets, tools, clothing, and accessories',
    words: [
      { civilianWord: 'Smartphone', imposterWord: 'Tablet', hint: 'Handheld touchscreen device' },
      { civilianWord: 'Headphones', imposterWord: 'Earbuds', hint: 'Personal audio gear' },
      { civilianWord: 'Backpack', imposterWord: 'Duffel Bag', hint: 'Carrying bag' },
      { civilianWord: 'Sunglasses', imposterWord: 'Goggles', hint: 'Eye protection' },
      { civilianWord: 'Umbrella', imposterWord: 'Raincoat', hint: 'Rain shield' },
      { civilianWord: 'Toothbrush', imposterWord: 'Hairbrush', hint: 'Bathroom grooming item' },
      { civilianWord: 'Wristwatch', imposterWord: 'Smartwatch', hint: 'Timepiece on your wrist' },
      { civilianWord: 'Keys', imposterWord: 'Keychain', hint: 'Door unlocking item' },
      { civilianWord: 'Sneakers', imposterWord: 'Boots', hint: 'Everyday footwear' },
      { civilianWord: 'Wallet', imposterWord: 'Purse', hint: 'Pocket money holder' },
      { civilianWord: 'Flashlight', imposterWord: 'Lantern', hint: 'Portable light beam' },
      { civilianWord: 'Microwave', imposterWord: 'Toaster Oven', hint: 'Kitchen heating appliance' },
      { civilianWord: 'Bicycle', imposterWord: 'Scooter', hint: 'Two-wheeled commute ride' },
      { civilianWord: 'Laptop', imposterWord: 'Desktop PC', hint: 'Portable computer' },
      { civilianWord: 'Coffee Mug', imposterWord: 'Thermos', hint: 'Warm drink cup' },
      { civilianWord: 'Pillow', imposterWord: 'Blanket', hint: 'Bedding for cozy sleep' },
      { civilianWord: 'Scissors', imposterWord: 'Knife', hint: 'Cutting utensil' },
      { civilianWord: 'AirPods', imposterWord: 'Bluetooth Speaker', hint: 'Wireless sound device' },
      { civilianWord: 'Power Bank', imposterWord: 'Phone Charger', hint: 'Battery charging device' },
      { civilianWord: 'Water Bottle', imposterWord: 'Flask', hint: 'Hydration container' }
    ]
  },
  {
    id: 'places-travel',
    name: 'Places & Travel',
    emoji: '✈️',
    description: 'Famous monuments, travel spots, and city sights',
    words: [
      { civilianWord: 'Eiffel Tower', imposterWord: 'Statue of Liberty', hint: 'World-famous metal landmark' },
      { civilianWord: 'Airport', imposterWord: 'Train Station', hint: 'Transit transit hub' },
      { civilianWord: 'Amusement Park', imposterWord: 'Water Park', hint: 'Thrill ride wonderland' },
      { civilianWord: 'Museum', imposterWord: 'Art Gallery', hint: 'Historical artifacts repository' },
      { civilianWord: 'Hotel', imposterWord: 'Resort', hint: 'Overnight vacation stay' },
      { civilianWord: 'Pyramids of Giza', imposterWord: 'Great Wall of China', hint: 'Ancient wonder of architecture' },
      { civilianWord: 'Library', imposterWord: 'Bookstore', hint: 'Quiet sanctuary of books' },
      { civilianWord: 'Beach', imposterWord: 'Island', hint: 'Sandy shoreline vacation' },
      { civilianWord: 'Cinema', imposterWord: 'Theater', hint: 'Screening big-screen shows' },
      { civilianWord: 'Campground', imposterWord: 'Cabin in Woods', hint: 'Outdoor wilderness stay' },
      { civilianWord: 'Casino', imposterWord: 'Arcade', hint: 'Jackpot betting establishment' },
      { civilianWord: 'Hospital', imposterWord: 'Clinic', hint: 'Emergency medical care facility' },
      { civilianWord: 'Times Square', imposterWord: 'Las Vegas Strip', hint: 'Bright neon billboard hub' },
      { civilianWord: 'Disneyland', imposterWord: 'Universal Studios', hint: 'Iconic theme park kingdom' },
      { civilianWord: 'Mount Everest', imposterWord: 'Mount Fuji', hint: 'World-famous mountain peak' }
    ]
  },
  {
    id: 'professions-roles',
    name: 'Professions & Jobs',
    emoji: '💼',
    description: 'Careers, emergency responders, and quirky roles',
    words: [
      { civilianWord: 'Astronaut', imposterWord: 'Pilot', hint: 'Space explorer' },
      { civilianWord: 'Detective', imposterWord: 'Secret Agent', hint: 'Mystery clue investigator' },
      { civilianWord: 'Chef', imposterWord: 'Baker', hint: 'Kitchen cooking master' },
      { civilianWord: 'Firefighter', imposterWord: 'Police Officer', hint: 'Emergency first responder' },
      { civilianWord: 'Doctor', imposterWord: 'Surgeon', hint: 'Healthcare diagnosis professional' },
      { civilianWord: 'Magician', imposterWord: 'Illusionist', hint: 'Performer of tricks & sleight of hand' },
      { civilianWord: 'Pirate', imposterWord: 'Sailor', hint: 'Treasure-hunting sea raider' },
      { civilianWord: 'Scientist', imposterWord: 'Professor', hint: 'Lab researcher of discovery' },
      { civilianWord: 'Architect', imposterWord: 'Interior Designer', hint: 'Building blueprint planner' },
      { civilianWord: 'Journalist', imposterWord: 'Photographer', hint: 'News story reporter' },
      { civilianWord: 'Life Guard', imposterWord: 'Scuba Diver', hint: 'Pool or beach safety watcher' },
      { civilianWord: 'Software Engineer', imposterWord: 'Video Game Developer', hint: 'Tech programmer' },
      { civilianWord: 'Judge', imposterWord: 'Lawyer', hint: 'Courtroom legal authority' },
      { civilianWord: 'Stand-up Comedian', imposterWord: 'Actor', hint: 'Humorous stage entertainer' }
    ]
  },
  {
    id: 'sports-hobbies',
    name: 'Sports & Hobbies',
    emoji: '⚽',
    description: 'Athletics, competitive games, and leisure activities',
    words: [
      { civilianWord: 'Tiger Woods', imposterWord: 'Rory McIlroy', hint: 'Legendary golf champion' },
      { civilianWord: 'Soccer', imposterWord: 'Basketball', hint: 'Global ball-kicking sport' },
      { civilianWord: 'Tennis', imposterWord: 'Badminton', hint: 'Racket net game' },
      { civilianWord: 'Bowling', imposterWord: 'Billiards', hint: 'Pin-knocking lane game' },
      { civilianWord: 'Chess', imposterWord: 'Checkers', hint: 'Strategic board game with Kings & Queens' },
      { civilianWord: 'Surfing', imposterWord: 'Skateboarding', hint: 'Wave-riding ocean board sport' },
      { civilianWord: 'Golf', imposterWord: 'Mini Golf', hint: 'Club swinging into a hole' },
      { civilianWord: 'Guitar', imposterWord: 'Ukulele', hint: 'Strummed string instrument' },
      { civilianWord: 'Yoga', imposterWord: 'Pilates', hint: 'Mindful stretching & pose exercise' },
      { civilianWord: 'Karate', imposterWord: 'Boxing', hint: 'Martial arts discipline' },
      { civilianWord: 'Gardening', imposterWord: 'Farming', hint: 'Planting flowers and vegetables' },
      { civilianWord: 'Lionel Messi', imposterWord: 'Cristiano Ronaldo', hint: 'GOAT football / soccer superstar' },
      { civilianWord: 'LeBron James', imposterWord: 'Michael Jordan', hint: 'NBA basketball icon' },
      { civilianWord: 'Snowboarding', imposterWord: 'Skiing', hint: 'Downhill winter snow sport' },
      { civilianWord: 'Formula 1', imposterWord: 'NASCAR', hint: 'High-speed motorsport racing' },
      { civilianWord: 'Swimming', imposterWord: 'Water Polo', hint: 'Pool aquatic competition' }
    ]
  },
  {
    id: 'spicy-party',
    name: 'Party Night & Fun',
    emoji: '🎉',
    description: 'Festivities, nightlife, party games, and hilarious tropes',
    words: [
      { civilianWord: 'Karaoke', imposterWord: 'Lip Sync', hint: 'Mic sing-along party staple' },
      { civilianWord: 'Truth or Dare', imposterWord: 'Never Have I Ever', hint: 'Classic confession party game' },
      { civilianWord: 'Costume Party', imposterWord: 'Masquerade', hint: 'Dress-up themed gathering' },
      { civilianWord: 'Beer Pong', imposterWord: 'Flip Cup', hint: 'College red-cup party game' },
      { civilianWord: 'Limbo', imposterWord: 'Conga Line', hint: 'Low-bar dance party challenge' },
      { civilianWord: 'DJ Booth', imposterWord: 'Dance Floor', hint: 'Heart of the dance club' },
      { civilianWord: 'Midnight Snack', imposterWord: 'Late Night Tacos', hint: 'Post-party 2 AM craving' },
      { civilianWord: 'Disco Ball', imposterWord: 'Strobe Light', hint: 'Glittering club ceiling fixture' },
      { civilianWord: 'Photobooth', imposterWord: 'Selfie Stick', hint: 'Party picture memory maker' },
      { civilianWord: 'Piñata', imposterWord: 'Confetti Cannon', hint: 'Party celebration bursting candy or glitter' },
      { civilianWord: 'Red Carpet', imposterWord: 'VIP Lounge', hint: 'Celebrity exclusive entrance' }
    ]
  }
];

export const STORAGE_CUSTOM_CATEGORIES_KEY = 'imposter_custom_categories_v1';
export const STORAGE_SCORES_KEY = 'imposter_player_scores_v1';
export const STORAGE_PRESETS_KEY = 'imposter_player_presets_v1';
export const STORAGE_SETTINGS_KEY = 'imposter_game_settings_v1';
