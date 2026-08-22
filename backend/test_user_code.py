arr=[3,4,2,1,5,8,7]
def merge_sort(arr): # [3,2]
    if len(arr)>1:
        mid = len(arr)//2 # 1
        left = arr[:mid] #left=[3]
        right = arr[mid:] # right=[2]
        merge_sort(left)
        merge_sort(right)
        lp=0
        rp=0
        fp=0
        while lp<len(left) and rp<len(right):
            if left[lp]<right[rp]: # 3<2
                arr[fp]=left[lp]
                lp+=1
            else:
                arr[fp]=right[rp] # arr[0]=2 #arr=[2,2]
                rp+=1
            fp+=1
        while lp<len(left): #lp=0 len=1
            arr[fp]=left[lp]
            lp+=1
            fp+=1
        while rp<len(right):
            arr[fp]=right[rp]
            rp+=1
            fp+=1
merge_sort(arr)
print(arr)
