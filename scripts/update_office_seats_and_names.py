# 1. Update Office3DView.tsx
with open('frontend/src/components/office/Office3DView.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Rename Kathan Jain -> Himanshu Lala
text = text.replace("name: 'Kathan Jain'", "name: 'Himanshu Lala'")

# Swap Giriraj & Sanjay coordinates and desks:
# Sanjay original:
#   desk_id: 'desk-sanjay',
#   home_coords: [-7, 0, -9.38],
#   current_coords: [-7, 0, -9.38],
# Giriraj original:
#   desk_id: 'cabin-giriraj',
#   home_coords: [13, 0, -9.32],
#   current_coords: [13, 0, -9.32],

old_sanjay_block = """    desk_id: 'desk-sanjay',
    home_coords: [-7, 0, -9.38],
    current_coords: [-7, 0, -9.38],"""

new_sanjay_block = """    desk_id: 'cabin-giriraj',
    home_coords: [13, 0, -9.32],
    current_coords: [13, 0, -9.32],"""

old_giriraj_block = """    desk_id: 'cabin-giriraj',
    home_coords: [13, 0, -9.32],
    current_coords: [13, 0, -9.32],"""

new_giriraj_block = """    desk_id: 'desk-sanjay',
    home_coords: [-7, 0, -9.38],
    current_coords: [-7, 0, -9.38],"""

# Replace sequentially with a unique placeholder
text = text.replace(old_sanjay_block, "TEMP_SANJAY_SWAP_BLOCK")
text = text.replace(old_giriraj_block, new_giriraj_block)
text = text.replace("TEMP_SANJAY_SWAP_BLOCK", new_sanjay_block)

# Add funny casual break phrases including lazy BA Bhupendra & Himanshu Lala banter
lazy_sofa_phrases = """              const sofaPhrases = [
                'Chai break time! Sofa pe thoda aish kar leta hu.',
                'Bhupendra bolta hai: Bhai sprint document kal banega, abhi aankh band karke chill maro!',
                'Himanshu Lala CI pipeline chhod ke chai ke nashe kar raha hai!',
                'Manoj bhai dekh na le, chup chaap phone scroll kar leta hu!',
                'AC chal raha hai mast, code to hota rahega kal subah!',
                '5 minute break bola tha, ab aadhe ghante se sofa pe betha hu!',
                'Bhupendra Jingar: Main to BA hu mera kaam bas meeting me haan bolna hai, code dev kare!'
              ];"""

text = text.replace("""              const sofaPhrases = [
                'Chai break time! Sofa pe thoda relax kar leta hu.',
                'Sprint task wrap ho gaya, thoda lounge me chill karte hain.',
                'Coffee pee ke next PR review plan karenge.',
                '5 minute break on lounge sofa, refresh hoke aate hain.'
              ];""", lazy_sofa_phrases)

with open('frontend/src/components/office/Office3DView.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated Office3DView.tsx with swapped seats, Himanshu Lala, and funny lounge banter!')
