# DagPlace
Similar to and not made by r/place. Massively multiplayer opensource peer to peer. Paint as many pixels as u want, change them at low lag, have 1/sqrt(numPixelsPainted) influence per pixel. 4 bit color. Each 4 bits chooses 1 of 14 colors transparent or 2x2 fork recursively. Fills a sparse tensor[infinity][infinity][14]. Color is max of [14] int54s

By massively multiplayer I mean each server might do a few hundred simultaneous users actively painting, or many thousands of users painting slowly now and then, and in peer to peer hopefully it will expand to at least a million simultaneous users all painting fast (so no 5 minute wait like in r/place, open the fire-hose cuz the math is correct of norming each player to a length 1 vector).

Early video on 1 computer where I simulate multiple users by holding 1 keyboard button per user while using mouse buttons to paint: https://www.youtube.com/watch?v=RkyEsPEqT_I
