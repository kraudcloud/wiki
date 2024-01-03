---
date: 2024-01-02
authors: [aep]
categories:
 - product
---


# focusing on on-prem in 2024

2024 will be a new chapter for kraud, taking learnings of the past year to focus on what matters most to our customers.

## Highlights

 - Our primary focus will shift towards on-prem cloud and data storage.
 - We want to replace the (large) office NAS and have some exciting products in the pipeline.
 - Reliability and Durability will be key criteria. 
 - We're in the process of finally finding a serious company name.

## public cloud price increase

Our primary mission is privacy and sustainability. Low prices are a side effect of energy efficiency rather than the goal.
With thousands of free tier users, we see a clear demand for a cheap public european cloud.
Yet in 2023 we have not been doing a good job of taking that audience onto the sustainability journey.
Educating a wide user base for free is a costly investment that directly conflicts with our goal to remain independant of destructive venture capital.

Price sensitive users are encouraged to look at lower price competitors such as Hetzner, or consider AWS free tier.
The datacenter in Berlin will actually need to expand due to demand from private cloud customers, so we may soon need to close registration of new free accounts.

It's a long road to a carbon neutral cloud. Focusing on customers with at least 64GB and up allows us to invest into longer term relationships
where we can actually help customers grow sustainably and look at their compute needs individually.


## Storage First

2023 was also a year of seeing where we actually compete on the market in terms of product quality.
Turns out competing data storage solution are terrible! Who knew.

We've upgraded our cloud SAN to a high performance 100G redundant NVME cluster so you can do compute directly on redundant dynamic storage.
Thinking this is the norm, but it really is not.

Of course you've got pure-storage, absolutely amazing stuff if you have the budget, but most smaller companies struggle with basic office NAS,
zero redundancy, slow transfers, etc. Even larger competing cloud service providers are unable to meet customers storage performance demands.
Out of the public clouds, only AWS is able to match our specs. Surprising.

At the same time, customers have made it very clear that they expect more from us in terms of usability.
While we currently don't even have a web ui for storage, this will improve dramatically over the next year.


## Outposts, the work from home cloud

Making the cloud come to where your data already is. Stored safe and secure in your own premise. 

A clear signal we got from you, our customers, is that you like our product for its ability to work on premise. 
Some customers aren't just disliking the cloud for pricing but they simply arent allowed to upload data there.
We're very excited about serving that niche and reducing the barrier to entry.

Not only is the on-prem experience going to improve in general, we're also finally adding a new device: the Mac Studio.

We recognized the difficulties in home office with moving data around with poor Internet. Some people log in to their office server to work on things via ssh.
Outposts are going to give every one of your team members a part of a unified data lab.
Copying files between different outposts and the central cluster is significantly faster than doing it over NFS, samba, web, etc,
because the outposts carry metadata and can copy only the relevant changes.

When working with VMs we want to enable moving the entire VM between different outposts.
This is already possible with containers today, but we learned that this doesn't fit the market need
so we'll give VMs the same capabilities. Just install a VM to your liking and move it back and forth between your outpost inside your virtual lab. 

It will actually keep the same public ip address no matter if it's running at home, in the cloud or in your lab. We might even be able to move it without rebooting.

We're also planing a feature that lets you just take a drive out of your outpost and physically move terrabytes of data between them.
Need that 10TB synchronized today? No worries, we'll send someone to pick up your encrypted drive within the same day and sync it with your main cluster.



## Virtual Labs, let the work come to the data

Sometimes you want the opposite. There's a large data treasury in the office, but you don't want it to leave the building.
Instead you want to bring the analysis to the data. We want to enable this workflow by creating isolated compute spaces that allow
anyone to run compute on specific files you share with them. Our technology already enables you to be safely isolate users from each other,
but we want to build a proper workflow management that fits the specific requirements of data based research.

A data lab can groups multiple resources, such as a specific amount of memory and CPU power over a whole cluster of machines.
It also specifies the exact file volumes that are accessible. 

Volumes from outposts can also be selected and will be available to others in the virtual lab.
This enables sharing of "personal" data with a lab, while retaining physical control. 
A possibly interesting feature to deal with the legal ambiguity of data "location".

Data clean rooms are using memory encryption and attestation so you can run analysis on someone else's outpost without
revealing the content of your own code or input data. A common requirement in the data trading business.


## let's hang out more

We have some absolutely amazing customers and partners who are helping us achieve sustainable computing.
I will spend much of the year traveling to different venues to meet old and new customers,
learning about how we can make your compute usage more effective and sustainable.

Hope you're all having a great start of 2024.
