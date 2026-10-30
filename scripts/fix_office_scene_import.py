with open('frontend/src/components/office/OfficeScene.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    "import React, { useRef, useEffect, useCallback } from 'react';",
    "import React, { useRef, useEffect, useCallback, useState } from 'react';"
)

with open('frontend/src/components/office/OfficeScene.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Added useState import to OfficeScene.tsx')
