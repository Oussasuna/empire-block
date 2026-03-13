/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/empire_game.json`.
 */
export type EmpireGame = {
  "address": "6P9oYuKMkw1z8goQkHqLhTuZy9aDEAnauG37ywNkpzjx",
  "metadata": {
    "name": "empireGame",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "acceptBattle",
      "docs": [
        "Step 2: Defender accepts — power is calculated, winner decided, land transferred if attacker wins.",
        "BattleChallenge PDA is kept on-chain as permanent history."
      ],
      "discriminator": [
        152,
        117,
        160,
        50,
        174,
        219,
        153,
        148
      ],
      "accounts": [
        {
          "name": "defender",
          "docs": [
            "The defender signing to accept the challenge."
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "defenderProfile",
          "docs": [
            "Defender's User profile."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "defender"
              }
            ]
          }
        },
        {
          "name": "attackerProfile",
          "docs": [
            "Attacker's User profile — updated with win/loss result."
          ],
          "writable": true
        },
        {
          "name": "attackerLand",
          "docs": [
            "The attacker's land (used for power calculation)."
          ]
        },
        {
          "name": "defenderLand",
          "docs": [
            "The defender's land that was challenged (may transfer owner on attacker win)."
          ],
          "writable": true
        },
        {
          "name": "game",
          "docs": [
            "Global game state — increments total_battles."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "battleChallenge",
          "docs": [
            "The challenge PDA created in initiate_battle.",
            "Stays on-chain after resolution as permanent history."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  97,
                  116,
                  116,
                  108,
                  101,
                  95,
                  99,
                  104,
                  97,
                  108,
                  108,
                  101,
                  110,
                  103,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "battle_challenge.attacker",
                "account": "battleChallenge"
              },
              {
                "kind": "account",
                "path": "battle_challenge.defender_land_id",
                "account": "battleChallenge"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "buyLand",
      "discriminator": [
        18,
        149,
        226,
        60,
        13,
        195,
        215,
        52
      ],
      "accounts": [
        {
          "name": "buyer",
          "writable": true,
          "signer": true
        },
        {
          "name": "seller",
          "writable": true
        },
        {
          "name": "land",
          "writable": true
        },
        {
          "name": "listing",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "cancelBattle",
      "docs": [
        "Attacker cancels an open challenge (e.g. after it expires).",
        "Battle fee is non-refundable. PDA stays on-chain as Cancelled history."
      ],
      "discriminator": [
        234,
        61,
        97,
        187,
        97,
        170,
        101,
        141
      ],
      "accounts": [
        {
          "name": "attacker",
          "docs": [
            "The original attacker — only they can cancel their own challenge."
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "battleChallenge",
          "docs": [
            "The challenge PDA to cancel."
          ],
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "cancelList",
      "discriminator": [
        187,
        218,
        153,
        135,
        148,
        115,
        63,
        197
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "land",
          "writable": true
        },
        {
          "name": "listing",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "editList",
      "discriminator": [
        64,
        253,
        134,
        129,
        129,
        21,
        167,
        120
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "land"
        },
        {
          "name": "listing",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "newPrice",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initialize",
      "docs": [
        "Initialize the global game state (admin only, called once)."
      ],
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "game",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "pricePerLand",
          "type": "u64"
        },
        {
          "name": "battleFee",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initializeUser",
      "docs": [
        "Create a new player profile (must be called before minting or battling)."
      ],
      "discriminator": [
        111,
        17,
        185,
        250,
        60,
        122,
        38,
        254
      ],
      "accounts": [
        {
          "name": "user",
          "docs": [
            "The wallet creating the profile (pays for rent)."
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "userProfile",
          "docs": [
            "User PDA — one profile per wallet, seeded by the wallet key."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "imageUrl",
          "type": "string"
        }
      ]
    },
    {
      "name": "initiateBattle",
      "docs": [
        "Step 1: Attacker opens a challenge against a target land.",
        "Pays battle fee upfront; challenge is open for 24 h."
      ],
      "discriminator": [
        248,
        205,
        226,
        209,
        41,
        28,
        54,
        75
      ],
      "accounts": [
        {
          "name": "attacker",
          "docs": [
            "The player starting the challenge (pays the battle fee + rent)."
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "attackerProfile",
          "docs": [
            "Attacker's User profile."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "attacker"
              }
            ]
          }
        },
        {
          "name": "attackerLand",
          "docs": [
            "The Land the attacker is fighting from (must own it)."
          ]
        },
        {
          "name": "defenderLand",
          "docs": [
            "The Land being challenged (must belong to someone else)."
          ]
        },
        {
          "name": "game",
          "docs": [
            "Global game state — reads battle_fee."
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "treasury",
          "writable": true
        },
        {
          "name": "battleChallenge",
          "docs": [
            "The challenge PDA — created here, resolved in accept_battle.",
            "Seeded by [attacker, defender_land_id] so only one open challenge",
            "per attacker→target land at a time."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  97,
                  116,
                  116,
                  108,
                  101,
                  95,
                  99,
                  104,
                  97,
                  108,
                  108,
                  101,
                  110,
                  103,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "date"
              },
              {
                "kind": "account",
                "path": "attacker"
              },
              {
                "kind": "arg",
                "path": "defenderLandId"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "date",
          "type": "i64"
        },
        {
          "name": "defenderLandId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "listLand",
      "discriminator": [
        50,
        143,
        168,
        92,
        139,
        223,
        216,
        182
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "land",
          "writable": true
        },
        {
          "name": "listing",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  115,
                  116,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "arg",
                "path": "date"
              },
              {
                "kind": "account",
                "path": "land.id",
                "account": "land"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "date",
          "type": "i64"
        },
        {
          "name": "price",
          "type": "u64"
        }
      ]
    },
    {
      "name": "mintLand",
      "docs": [
        "Mint a new Land NFT for the caller."
      ],
      "discriminator": [
        75,
        54,
        3,
        185,
        72,
        242,
        123,
        69
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "game",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "treasury",
          "writable": true
        },
        {
          "name": "land",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  97,
                  110,
                  100
                ]
              },
              {
                "kind": "arg",
                "path": "date"
              }
            ]
          }
        },
        {
          "name": "userProfile",
          "docs": [
            "The minter's User profile — must be initialized via initialize_user first."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "date",
          "type": "i64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "battleChallenge",
      "discriminator": [
        156,
        129,
        11,
        185,
        152,
        237,
        151,
        142
      ]
    },
    {
      "name": "game",
      "discriminator": [
        27,
        90,
        166,
        125,
        74,
        100,
        121,
        18
      ]
    },
    {
      "name": "land",
      "discriminator": [
        189,
        66,
        11,
        232,
        213,
        113,
        244,
        167
      ]
    },
    {
      "name": "listing",
      "discriminator": [
        218,
        32,
        50,
        73,
        43,
        134,
        26,
        58
      ]
    },
    {
      "name": "user",
      "discriminator": [
        159,
        117,
        95,
        227,
        239,
        151,
        58,
        236
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "maxSupplyReached",
      "msg": "Max land supply reached (2500)"
    },
    {
      "code": 6001,
      "name": "invalidCoordinates",
      "msg": "Invalid grid coordinates"
    },
    {
      "code": 6002,
      "name": "cellAlreadyMinted",
      "msg": "This grid cell is already minted"
    },
    {
      "code": 6003,
      "name": "notOwner",
      "msg": "You are not the owner of this land"
    },
    {
      "code": 6004,
      "name": "notLandOwner",
      "msg": "You are not the owner of this land"
    },
    {
      "code": 6005,
      "name": "alreadyListed",
      "msg": "This land is already listed"
    },
    {
      "code": 6006,
      "name": "notListed",
      "msg": "This land is not listed"
    },
    {
      "code": 6007,
      "name": "territoryFrozen",
      "msg": "Territory is frozen and cannot attack or be attacked"
    },
    {
      "code": 6008,
      "name": "notAdjacent",
      "msg": "You can only attack adjacent territories"
    },
    {
      "code": 6009,
      "name": "cannotAttackSelf",
      "msg": "You cannot attack your own territory"
    },
    {
      "code": 6010,
      "name": "attackerFrozen",
      "msg": "Attacker territory is frozen"
    },
    {
      "code": 6011,
      "name": "defenderFrozen",
      "msg": "Defender territory is frozen"
    },
    {
      "code": 6012,
      "name": "landFrozen",
      "msg": "Territory is frozen"
    },
    {
      "code": 6013,
      "name": "maxLevelReached",
      "msg": "Territory is already at max level (5)"
    },
    {
      "code": 6014,
      "name": "insufficientTokens",
      "msg": "Insufficient tokens for upgrade"
    },
    {
      "code": 6015,
      "name": "imageUrlTooLong",
      "msg": "Image URL exceeds maximum length (200 chars)"
    },
    {
      "code": 6016,
      "name": "userAlreadyExists",
      "msg": "User profile already exists"
    },
    {
      "code": 6017,
      "name": "challengeNotPending",
      "msg": "Battle challenge is not in Pending status"
    },
    {
      "code": 6018,
      "name": "challengeExpired",
      "msg": "Battle challenge has expired"
    }
  ],
  "types": [
    {
      "name": "battleChallenge",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "attacker",
            "type": "pubkey"
          },
          {
            "name": "defender",
            "type": "pubkey"
          },
          {
            "name": "attackerLandId",
            "type": "u64"
          },
          {
            "name": "defenderLandId",
            "type": "u64"
          },
          {
            "name": "battleFee",
            "type": "u64"
          },
          {
            "name": "expiresAt",
            "type": "i64"
          },
          {
            "name": "initiatedAt",
            "type": "i64"
          },
          {
            "name": "week",
            "type": "u64"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "battleChallengeStatus"
              }
            }
          },
          {
            "name": "attackerPower",
            "type": "u64"
          },
          {
            "name": "defenderPower",
            "type": "u64"
          },
          {
            "name": "winner",
            "type": "pubkey"
          },
          {
            "name": "loser",
            "type": "pubkey"
          },
          {
            "name": "resolvedAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "battleChallengeStatus",
      "docs": [
        "Status of a BattleChallenge PDA."
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "pending"
          },
          {
            "name": "completed"
          },
          {
            "name": "cancelled"
          }
        ]
      }
    },
    {
      "name": "game",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "treasury",
            "type": "pubkey"
          },
          {
            "name": "totalLands",
            "type": "u64"
          },
          {
            "name": "pricePerLand",
            "type": "u64"
          },
          {
            "name": "battleFee",
            "type": "u64"
          },
          {
            "name": "prizePool",
            "type": "u64"
          },
          {
            "name": "totalBattles",
            "type": "u64"
          },
          {
            "name": "currentWeek",
            "type": "u64"
          },
          {
            "name": "mintedCorner",
            "type": "u16"
          },
          {
            "name": "mintedCapital",
            "type": "u16"
          },
          {
            "name": "mintedBorder",
            "type": "u16"
          },
          {
            "name": "mintedStandard",
            "type": "u16"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "land",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "hp",
            "type": "u64"
          },
          {
            "name": "level",
            "type": "u8"
          },
          {
            "name": "isListed",
            "type": "bool"
          },
          {
            "name": "listing",
            "type": "u16"
          },
          {
            "name": "genesisOwner",
            "type": "pubkey"
          },
          {
            "name": "territoryType",
            "type": {
              "defined": {
                "name": "territoryType"
              }
            }
          },
          {
            "name": "frozenUntil",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "listing",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "seller",
            "type": "pubkey"
          },
          {
            "name": "landId",
            "type": "u64"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "isActive",
            "type": "bool"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "buyer",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "territoryType",
      "docs": [
        "Territory type — assigned randomly on mint.",
        "Hard supply caps (out of 2500 total):",
        "Corner: 4 | Capital: 25 | Border: 192 | Standard: 2279"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "standard"
          },
          {
            "name": "border"
          },
          {
            "name": "capital"
          },
          {
            "name": "corner"
          }
        ]
      }
    },
    {
      "name": "user",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "imageUrl",
            "type": "string"
          },
          {
            "name": "territoriesCount",
            "type": "u32"
          },
          {
            "name": "totalLandsOwned",
            "type": "u32"
          },
          {
            "name": "wins",
            "type": "u32"
          },
          {
            "name": "losses",
            "type": "u32"
          },
          {
            "name": "winStreak",
            "type": "u32"
          },
          {
            "name": "weeklyWins",
            "type": "u32"
          },
          {
            "name": "lastWeekRecorded",
            "type": "u64"
          },
          {
            "name": "totalPower",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "seedBattleChallenge",
      "type": "bytes",
      "value": "[98, 97, 116, 116, 108, 101, 95, 99, 104, 97, 108, 108, 101, 110, 103, 101]"
    },
    {
      "name": "seedGame",
      "type": "bytes",
      "value": "[103, 97, 109, 101]"
    },
    {
      "name": "seedLand",
      "type": "bytes",
      "value": "[108, 97, 110, 100]"
    },
    {
      "name": "seedListing",
      "type": "bytes",
      "value": "[108, 105, 115, 116, 105, 110, 103]"
    },
    {
      "name": "seedMap",
      "type": "bytes",
      "value": "[109, 97, 112]"
    },
    {
      "name": "seedUser",
      "type": "bytes",
      "value": "[117, 115, 101, 114]"
    }
  ]
};
